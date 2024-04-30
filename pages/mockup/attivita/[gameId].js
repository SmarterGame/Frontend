import LayoutGames from "@/components/LayoutGames";
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSelectedLanguage } from "@/components/lib/language";
import { useSmarter, LED_BLUE_ACTION, LED_RED_ACTION, LED_WHITE_ACTION, LED_GREEN_ACTION } from "@/data/mqtt/hooks";
import { SMARTER_ID_1 } from "@/data/mqtt/connector";
import { convertTagToSymbol } from "@/utils/smarter";

export const getServerSideProps = async ({ req, res, query }) => {
    const FEEDBACK = process.env.FEEDBACK;
    const url = process.env.BACKEND_URI;
    try {
        const {gameId, level = 1} = query;
        const session = await getSession(req, res);

        const token = "Bearer " + session.accessToken;

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

        let user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: token,
            },
        });
        if (user.data.IsIndividual === true)
            user.data.SelectedClass = user.data.SelectedIndividual;
        // console.log(user.data.SelectedClass);

        //Fetch profile image
        const profileImg = await axios({
            method: "get",
            url: url + "/user/profileImg",
            headers: {
                Authorization: token,
            },
            responseType: "arraybuffer",
        });
        // console.log(profileImg.data);
        let imageUrl = null;
        if (Object.keys(profileImg.data).length !== 0) {
            const image = Buffer.from(profileImg.data, "binary").toString(
                "base64"
            );
            imageUrl = `data:image/png;base64,${image}`;
        }

        //Fetch individual data
        const classData = await axios({
            method: "get",
            url: url + "/individual/getData/" + user.data.SelectedIndividual,
            headers: {
                Authorization: token,
            },
        });
        // console.log(classData.data);

        const game = await axios
            .get(url + "/games/" + gameId, {
                headers: {
                    Authorization: token,
                },
            })

        return {
            props: {
                token: session.accessToken,
                url: url,
                selectedClass: user.data.SelectedClass,
                classRoom: classData.data,
                FEEDBACK: FEEDBACK,
                profileImg: imageUrl,
                game: game.data,
                level: level
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Game({
    token,
    url,
    selectedClass,
    classRoom,
    FEEDBACK,
    profileImg,
    game,
    level
}) {
    const router = useRouter();
    //const { gameId, level } = router.query; //game = quantita or ordinamenti
    const mode = game?.mode;
    const {events, sendAction} = useSmarter({smarterId: SMARTER_ID_1});
    const [error, setError] = useState(false);
    const [subLvl, setsubLvl] = useState(0);
    const [currentExe, setCurrentExe] = useState(0);
    const [lvlDataCorrect, setLvlDataCorrect] = useState(game?.levels[+level-1]?.exercises?.[currentExe]?.endSeq ?? ['x','x','x','x','x']);
    const [lvlData, setLvlData] = useState(game?.levels[+level-1]?.exercises?.[currentExe]?.startSeq?.map(item => item === "_" ? "" : item) ?? []); //Used to check the correct solution
    const [inputValues, setInputValues] = useState(['','','','','']); //Used to store the input values
    const [isCorrect, setIsCorrect] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [isWrong, setIsWrong] = useState([false, false, false, false, false]);

    const [selectedLanguage, setSelectedLanguage] = useState();
    useEffect(() => {
        //Fetch the language
        // const fetchLanguage = async () => {
        //     try {
        //         const data = await fetch("/api/language/getLanguage");
        //         const language = await data.json();
        //         setSelectedLanguage(language);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };
        // fetchLanguage();
        setSelectedLanguage(sessionStorage.getItem("language"));
    }, []);

    //Get level data
    // useEffect(() => {
    //     // TODO: reimplement subLvl
    //     axios
    //         .get(url + "/games/" + gameId, {
    //             headers: {
    //                 Authorization: "Bearer " + token,
    //             },
    //         })
    //         .then((res) => {
    //             // Set led to white when starting game
    //             console.log(res.data.levels[+level]);
    //             sendAction(LED_WHITE_ACTION)
    //             setLvlData(res.data.levels[+level-1].startSeq?.map(item => item === "_" ? "" : item));
    //             const inputs = document.querySelectorAll("input[name]");
    //             inputs.forEach((input) => {
    //                 input.value = "";
    //             });
    //             setIsCorrect([false, false, false, false, false]);
    //             setInputValues(['','','','','']);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, [subLvl]);

    //Check if the solution is correct
    useEffect(() => {
        console.log(inputValues);
        console.log(lvlData);
        for (let i = 0; i < lvlData.length; i++) {
            if (inputValues[i] == lvlDataCorrect[i]) {
                setIsCorrect((prevState) => {
                    const newState = [...prevState];
                    newState[i] = true;
                    return newState;
                });
                setIsWrong((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
            } else {
                setIsCorrect((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
                if (inputValues[i] != undefined) {
                    setIsWrong((prevState) => {
                        const newState = [...prevState];
                        newState[i] = true;
                        return newState;
                    });
                }
            }

            //If input is empty set isCorrect and isWrong to false
            if (inputValues[i] == "") {
                setIsCorrect((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
                setIsWrong((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
            }
        }
    }, [inputValues]);

    // useEffect(() => {
    //     const event = events[events.length-1];
    //     if (event?.event === "card_placed") {
    //         const value = convertTagToSymbol(event?.value);
    //         // sendAction(value == lvlData[event.reader] ? LED_GREEN_ACTION : LED_RED_ACTION);
    //         // setTimeout(() => sendAction(LED_WHITE_ACTION), 750);
    //     }
    // }, [events])

    //Check if there is an error in the input
    useEffect(() => {
        if (isWrong.includes(true)) setError(true);
    }, [isWrong]);

    //Handle next level
    useEffect(() => {
        if (isCorrect.every((el) => el === true)) {
            if (subLvl < game?.levels[+level-1]?.exercises?.length-1) {
                const title =
                    selectedLanguage === "eng" ? "CORRECT!" : "CORRETTO!";
                const html =
                    selectedLanguage === "eng"
                        ? "Exercise " + (subLvl + 1) + "/" + game?.levels[+level-1]?.exercises?.length + "completed"
                        : "Esercizio " + (subLvl + 1) + "/" + game?.levels[+level-1]?.exercises?.length + "completato";

                Swal.fire({
                    title: title,
                    color: "#ff7100",
                    html: html,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        setLvlData(game?.levels[+level-1]?.exercises?.[currentExe]?.startSeq ?? ['x','x','x','x','x'])
                        setLvlDataCorrect(game?.levels[+level-1]?.exercises?.[currentExe]?.endSeq ?? ['x','x','x','x','x']);
                        setsubLvl((prevState) => prevState + 1);
                    }
                });
            } else {
                const title =
                    selectedLanguage === "eng"
                        ? "CONGRATULATIONS!"
                        : "COMPLIMENTI!";
                const html =
                    selectedLanguage === "eng"
                        ? "Level " + level + " completed"
                        : "Livello " + level + " completato";

                sendAction(LED_GREEN_ACTION);
                sendAction(LED_GREEN_ACTION);

                Swal.fire({
                    title: title,
                    color: "#ff7100",
                    html: html,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        sendAction(LED_BLUE_ACTION);
                        sendAction(LED_BLUE_ACTION);
                        gameFinished();
                    }
                });
            }
        }
    }, [isCorrect]);

    useEffect(() => {
        if (!isCorrect.every(Boolean)) {
            console.log("Enter")
            console.log(isCorrect);
            setInputValues(events[events.length-1] ?? ['','','','','']);
        }
    }, [events])

    //API TODO: pensaci sopra
    const gameFinished = async () => {
        try {
            // const res = await axios({
            //     method: "get",
            //     url:
            //         url +
            //         "/classroom/gameFinished/" +
            //         selectedClass +
            //         "?game=" +
            //         game +
            //         "&level=" +
            //         levelIndividual +
            //         "&error=" +
            //         error +
            //         "&individual=true",
            //     headers: {
            //         Authorization: "Bearer " + token,
            //     },
            // });
            // Da capire come posso fare a tirare fuori queste info ? probabilemente dall'istanza di gioco
            router.push({
                pathname: "/mockup/gamification",
                query: {
                    game: game,
                    level: level,
                    //badgeData: JSON.stringify(res.data.badgeEarned),
                    selectedLanguage: selectedLanguage,
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    if (!game) {
        return null;
    }

    console.log(lvlData);

    return (
        <>
            {/* <button onClick={gameFinished} className="bg-red-500">
                test API
            </button> */}

            <LayoutGames
                classRoom={classRoom}
                title={game?.name}
                liv={level}
                profileImg={profileImg}
            >
                <div className="flex mt-6">
                    <h1 className="mx-auto text-2xl">
                        {game?.assignment}
                    </h1>
                </div>
                <div className="relative flex flex-col justify-center md:h-[55vh] lg:h-[60vh] mt-10 ml-4 mr-4 z-10">
                    <div className="flex flex-col items-center h-full w-full">
                        <div className="grid grid-cols-5 justify-items-center gap-y-4 gap-x-14 h-full w-[65%]">
                            {lvlData.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-200 w-full flex justify-center items-center text-8xl col-span-1 row-span-1 overflow-hidden"
                                >
                                    {item}
                                </div>
                            ))}
                            {Array.from({ length: 5 }, (_, index) => (
                                <div
                                    key={index}
                                    className={`bg-slate-200 border-4 ${
                                        FEEDBACK === "true"
                                            ? `${
                                                  isCorrect[index]
                                                      ? "border-green-500"
                                                      : ""
                                              } ${
                                                  isWrong[index]
                                                      ? "border-red-500"
                                                      : ""
                                              }`
                                            : ``
                                    } w-full flex justify-center items-center text-8xl col-span-1 row-span-1 h-full`}
                                >
                                    {/* <input
                                        className="text-6xl text-center w-20"
                                        name={index}
                                        onChange={handleInputChange}
                                    ></input> */}
                                    {inputValues?.[index]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
