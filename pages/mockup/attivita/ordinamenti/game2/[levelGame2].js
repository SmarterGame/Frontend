import LayoutGames from "@/components/LayoutGames";
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSelectedLanguage } from "@/components/lib/language";
import { useSmarter, LED_GREEN_ACTION, LED_BLUE_ACTION, LED_RED_ACTION, LED_WHITE_ACTION } from "@/data/mqtt/hooks";
import { convertTagToSymbol } from "@/utils/smarter";
import { SMARTER_ID_1, SMARTER_ID_2 } from "@/data/mqtt/connector";

export const getServerSideProps = async ({ req, res }) => {
    const FEEDBACK = process.env.FEEDBACK;
    const url = process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);

        const token = "Bearer " + session.accessToken;

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

        const user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: token,
            },
        });
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

        //Fetch classroom data
        const classData = await axios({
            method: "get",
            url: url + "/classroom/getClassroomData/" + user.data.SelectedClass,
            headers: {
                Authorization: token,
            },
        });
        // console.log(classData.data);

        return {
            props: {
                token: session.accessToken,
                url: url,
                selectedClass: user.data.SelectedClass,
                classRoom: classData.data,
                FEEDBACK: FEEDBACK,
                profileImg: imageUrl,
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
}) {
    const router = useRouter();
    const { levelGame2, game } = router.query; //game = quantita or ordinamenti
    const {events: eventsLeft, info: infoLeft, sendAction: sendActionLeft} = useSmarter({smarterId: SMARTER_ID_1});
    const {events: eventsRight, info: infoRight, sendAction: sendActionRight} = useSmarter({smarterId: SMARTER_ID_2});
    const [error, setError] = useState(false);
    const [subLvl, setsubLvl] = useState(0);
    const [lvlData, setLvlData] = useState([]); //Used to display the data
    const [lvldDataCorrect, setLvlDataCorrect] = useState([]); //Used to check the correct solution
    const [inputValues, setInputValues] = useState(['','','','','','','','','','']); //Used to store the input values
    const [isCorrect, setIsCorrect] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]);
    const [isWrong, setIsWrong] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]);

    const [isCrescente, setisCrescente] = useState(true);

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
    useEffect(() => {
        axios
            .get(url + "/games/" + game + "/hpi/" + levelGame2, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                sendActionLeft(LED_WHITE_ACTION)
                sendActionRight(LED_WHITE_ACTION)
                const tmp = res.data[subLvl].pop(); //tmp = 0 incremento, tmp = 1 decreasing
                const data = [...res.data[subLvl]];
                //Check if the array is in crescent order
                if (tmp) {
                    setisCrescente(false);
                    //sort the array in decrescent order
                    setLvlDataCorrect(res.data[subLvl].sort((a, b) => b - a));
                } else {
                    setisCrescente(true);
                    //sort the array in crescent order
                    setLvlDataCorrect(res.data[subLvl].sort((a, b) => a - b));
                }

                setLvlData(data);
                const inputs = document.querySelectorAll("input[name]");
                inputs.forEach((input) => {
                    input.value = "";
                });
                setIsCorrect([
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ]);
                setInputValues(['','','','','','','','','','']);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [subLvl]);

    //Check if the solution is correct
    useEffect(() => {
        for (let i = 0; i < lvldDataCorrect.length; i++) {
            if (inputValues[i] == lvldDataCorrect[i]) {
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

            //If input is empty set isWrong to false
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

    useEffect(() => {
        const event = eventsLeft[0];
        if (event?.event === "card_placed") {
            const value = convertTagToSymbol(event?.value);
            sendActionLeft(value == lvlData[event.reader] ? LED_GREEN_ACTION : LED_RED_ACTION);
            setTimeout(() => sendActionLeft(LED_WHITE_ACTION), 750);
        }
    }, [eventsLeft]);

    useEffect(() => {
        const event = eventsRight[0];
        if (event?.event === "card_placed") {
            const value = convertTagToSymbol(event?.value);
            sendActionRight(value == lvlData[event.reader + 5] ? LED_GREEN_ACTION : LED_RED_ACTION);
            setTimeout(() => sendActionRight(LED_WHITE_ACTION), 750);
        }
    }, [eventsRight]);

    //Check if there is an error in the input
    useEffect(() => {
        if (isWrong.includes(true)) setError(true);
    }, [isWrong]);

    //Handle next level
    useEffect(() => {
        if (isCorrect.every((el) => el === true)) {
            if (subLvl < 4) {
                const title =
                    selectedLanguage === "eng" ? "CORRECT!" : "CORRETTO!";
                const html =
                    selectedLanguage === "eng"
                        ? "Exercise " + (subLvl + 1) + "/5 completed"
                        : "Esercizio " + (subLvl + 1) + "/5 completato";

                sendActionLeft(LED_GREEN_ACTION);
                sendActionRight(LED_GREEN_ACTION);

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
                        sendActionLeft(LED_BLUE_ACTION);
                        sendActionRight(LED_BLUE_ACTION);
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
                        ? "Level " + levelGame2 + " completed"
                        : "Livello " + levelGame2 + " completato";

                sendActionLeft(LED_GREEN_ACTION);
                sendActionRight(LED_GREEN_ACTION);

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
                        sendActionLeft(LED_BLUE_ACTION);
                        sendActionRight(LED_BLUE_ACTION);
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
            setInputValues(prev => [...infoLeft, ...prev.filter((_,id) => id >= 5)]);
        }
    }, [infoLeft])

    useEffect(() => {
        if (!isCorrect.every(Boolean)) {
            console.log("Enter")
            console.log(isCorrect);
            setInputValues(prev => [...prev.filter((_,id) => id < 5),...infoRight]);
        }
    }, [infoRight])

    //API call to set game as finished
    const gameFinished = async () => {
        try {
            const res = await axios({
                method: "get",
                url:
                    url +
                    "/classroom/gameFinished/" +
                    selectedClass +
                    "?game=" +
                    game +
                    "&level=" +
                    levelGame2 +
                    "&error=" +
                    error +
                    "&individual=false",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            // console.log(res);
            router.push({
                pathname: "/mockup/gamification",
                query: {
                    game: game,
                    level: levelGame2,
                    badgeData: JSON.stringify(res.data.badgeEarned),
                    selectedLanguage: selectedLanguage,
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {/* <button onClick={gameFinished} className="bg-red-500">
                test API
            </button> */}

            <LayoutGames
                classRoom={classRoom}
                title={game}
                liv={levelGame2}
                profileImg={profileImg}
            >
                <div className="flex mt-6">
                    <h1 className="mx-auto text-2xl">
                        {selectedLanguage === "eng"
                            ? isCrescente
                                ? "Arrange the numbers in increasing order using the tiles " +
                                  (levelGame2 === "1"
                                      ? "“apples”"
                                      : "“numbers”")
                                : "Arrange the numbers in decreasing order using the tiles " +
                                  (levelGame2 === "1"
                                      ? "“apples”"
                                      : "“numbers”")
                            : isCrescente
                            ? "Ordina i numeri in ordine crescente, usando le tessere " +
                              (levelGame2 === "1" ? "“mela”" : "“cifre”")
                            : "Ordina i numeri in ordine decrescente, usando le tessere " +
                              (levelGame2 === "1" ? "“mela”" : "“cifre”")}
                    </h1>
                </div>
                <div className="relative flex flex-col justify-center md:h-[55vh] lg:h-[60vh] mt-10 ml-4 mr-4 z-10">
                    <div className="grid grid-cols-10 justify-items-center gap-y-4 gap-x-4 h-full">
                        {lvlData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-slate-200 w-full flex justify-center items-center text-8xl"
                            >
                                {item}
                            </div>
                        ))}
                        {Array.from({ length: 10 }, (_, index) => (
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
                                } w-full flex justify-center items-center text-8xl`}
                            >
                                {/* <input
                                        className="text-6xl text-center w-20"
                                        name={index}
                                        onChange={handleInputChange}
                                    ></input> */}
                                    <div
                                        className="text-6xl text-center w-20"
                                        name={index}
                                    >{inputValues?.[index]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
