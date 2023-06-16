import LayoutGames from "@/components/LayoutGames";
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSelectedLanguage } from "@/components/lib/language";
import { useHasHydrated } from "@/utils/hooks";
import { initMqtt } from "@/data/mqtt/connector";
import { convertTagToSymbol } from "@/utils/smarter";

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
    const hydrated = useHasHydrated();
    const { levelGame2, game } = router.query; //game = quantita or ordinamenti

    const [error, setError] = useState(false);
    const [subLvl, setsubLvl] = useState(0);
    const [lvlData, setLvlData] = useState([]); //Used to display the data
    const [lvldDataCorrect, setLvlDataCorrect] = useState([]); //Used to check the correct solution
    const [inputValues, setInputValues] = useState({}); //Used to store the input values
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
            })
            .catch((err) => {
                console.log(err);
            });

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
        setInputValues({});
    }, [subLvl]);

    //Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

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

                Swal.fire({
                    title: title,
                    color: "#ff7100",
                    html: html,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
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

                Swal.fire({
                    title: title,
                    color: "#ff7100",
                    html: html,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        gameFinished();
                    }
                });
            }
        }
    }, [isCorrect]);

    // setup connection mqtt
    useEffect(() => {
        // prevent to open an extraconnection during server rendering
        if (!hydrated) return;

        const topic = 'smarter/letturaRFID';

        const client = initMqtt(topic);

        client.on('connect', () => {
            console.log('Connected')
        })

        client.on('message', (topic, payload) => {
            console.log(payload.toString());
            const json = JSON.parse(payload.toString());

            const values = Object.keys(json).map((index) => convertTagToSymbol(json[index]?.tag));

            setInputValues(values);
            console.log(values);
        })

        return () => {
            if (client) {
                client.unsubscribe(topic);
                client.end(client);
            }
        };
    },[hydrated]);

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
                                        onChange={handleInputChange}
                                    >{inputValues?.[index]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
