import LayoutGames from "@/components/LayoutGames";
import Image from "next/image";
import leone from "@/public/leone.svg";
import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import _ from "lodash";
import { getSelectedLanguage } from "@/components/lib/language";
import { useSmarter, LED_GREEN_ACTION, LED_BLUE_ACTION } from "@/data/mqtt/hooks";
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

//LOW POSITIVE INTERDIPENDENCE
export default function Game1({
    token,
    url,
    selectedClass,
    classRoom,
    FEEDBACK,
    profileImg,
}) {
    const router = useRouter();
    const { levelGame1, game } = router.query; //game = quantita or ordinamenti
    const {events: eventsLeft, sendAction: sendActionLeft} = useSmarter({smarterId: SMARTER_ID_1});
    const {events: eventsRight, sendAction: sendActionRight} = useSmarter({smarterId: SMARTER_ID_2});
    const [error, setError] = useState(false);
    const [subLvl, setsubLvl] = useState(0);
    const [lvlDataLeft, setLvlDataLeft] = useState([]);
    const [lvlDataRight, setLvlDataRight] = useState([]);
    // const [lvlDataShuffled, setLvlDataShuffled] = useState([]); //Used to display the data
    const [inputValuesLeft, setinputValuesLeft] = useState(new Array(5));
    const [isCorrectLeft, setisCorrectLeft] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [isWrongLeft, setisWrongLeft] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [inputValuesRight, setinputValuesRight] = useState(new Array(5));
    const [isCorrectRight, setisCorrectRight] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [isWrongRight, setisWrongRight] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [isAllCorrect, setisAllCorrect] = useState([false, false]);

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
            .get(url + "/games/" + game + "/lpi/" + levelGame1, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                setLvlDataLeft(res.data[subLvl].slice(0, 5));
                setLvlDataRight(res.data[subLvl].slice(5, 10));
            })
            .catch((err) => {
                console.log(err);
            });

        const inputs = document.querySelectorAll("input[name]");
        inputs.forEach((input) => {
            input.value = "";
        });
        setisCorrectLeft([false, false, false, false, false]);
        setisCorrectRight([false, false, false, false, false]);
        setinputValuesLeft(new Array(5));
        setinputValuesRight(new Array(5));
    }, [subLvl]);

    useEffect(() => {
        // update states left smarter
        eventsLeft.map((event) => {
            const convValue = convertTagToSymbol(event?.value);
        
            setinputValuesLeft((prev) => {
                const newArr = [...prev];
                newArr[event.reader] = event.event === "card_placed" ? convValue : "";
                return newArr;
            })
        });

        // update states right smarter
        eventsRight.map((event) => {
            const convValue = convertTagToSymbol(event?.value);
        
            setinputValuesRight((prev) => {
                const newArr = [...prev];
                newArr[event.reader] = event.event === "card_placed" ? convValue : "";
                return newArr;
            })
        });
    }, [eventsLeft, eventsRight])

    //Check if input of the left smarter is correct
    useEffect(() => {
        for (let i = 0; i < lvlDataLeft.length; i++) {
            if (inputValuesLeft[i] == lvlDataLeft[i]) {
                setisCorrectLeft((prevState) => {
                    const newState = [...prevState];
                    newState[i] = true;
                    return newState;
                });
                setisWrongLeft((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
            } else {
                setisCorrectLeft((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
                if (inputValuesLeft[i] != undefined) {
                    setisWrongLeft((prevState) => {
                        const newState = [...prevState];
                        newState[i] = true;
                        return newState;
                    });
                }
            }

            //If left input is empty set isCorrect and isWrong to false
            if (inputValuesLeft[i] == "") {
                setisCorrectLeft((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
                setisWrongLeft((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
            }
        }
    }, [inputValuesLeft]);

    //Check if there is an error in the left input
    useEffect(() => {
        if (isWrongLeft.includes(true)) setError(true);
    }, [isWrongLeft]);

    //Check if all left smarter is correct
    useEffect(() => {
        if (isCorrectLeft.every((el) => el === true)) {
            setisAllCorrect((prevState) => {
                const newState = [...prevState];
                newState[0] = true;
                return newState;
            });
        } else {
            setisAllCorrect((prevState) => {
                const newState = [...prevState];
                newState[0] = false;
                return newState;
            });
        }
    }, [isCorrectLeft]);

    //Check if input of the right smarter is correct
    useEffect(() => {
        for (let i = 0; i < lvlDataRight.length; i++) {
            if (inputValuesRight[i] == lvlDataRight[i]) {
                setisCorrectRight((prevState) => {
                    const newState = [...prevState];
                    newState[i] = true;
                    return newState;
                });
                setisWrongRight((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
            } else {
                setisCorrectRight((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
                if (inputValuesRight[i] != undefined) {
                    setisWrongRight((prevState) => {
                        const newState = [...prevState];
                        newState[i] = true;
                        return newState;
                    });
                }
            }

            //If left input is empty set isCorrect and isWrong to false
            if (inputValuesRight[i] == "") {
                setisCorrectRight((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
                setisWrongRight((prevState) => {
                    const newState = [...prevState];
                    newState[i] = false;
                    return newState;
                });
            }
        }
    }, [inputValuesRight]);

    //Check if there is an error in the right input
    useEffect(() => {
        if (isWrongRight.includes(true)) setError(true);
    }, [isWrongRight]);

    //Check if all right smarter is correct
    useEffect(() => {
        if (isCorrectRight.every((el) => el === true)) {
            setisAllCorrect((prevState) => {
                const newState = [...prevState];
                newState[1] = true;
                return newState;
            });
        } else {
            setisAllCorrect((prevState) => {
                const newState = [...prevState];
                newState[1] = false;
                return newState;
            });
        }
    }, [isCorrectRight]);

    //Check if both smarters are correct
    useEffect(() => {
        if (isAllCorrect.every((el) => el === true)) {
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
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        sendActionLeft(LED_BLUE_ACTION);
                        sendActionRight(LED_BLUE_ACTION)
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
                        ? "Level " + levelGame1 + " completed"
                        : "Livello " + levelGame1 + " completato";

                sendActionLeft(LED_GREEN_ACTION);
                sendActionRight(LED_GREEN_ACTION);

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
                        sendActionLeft(LED_BLUE_ACTION);
                        sendActionRight(LED_BLUE_ACTION);
                        gameFinished();
                    }
                });
            }
        }
    }, [isAllCorrect]);

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
                    levelGame1 +
                    "&error=" +
                    error +
                    "&individual=false",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            // console.log(res.data);
            router.push({
                pathname: "/mockup/gamification",
                query: {
                    game: game,
                    level: levelGame1,
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
                title={game}
                liv={levelGame1}
                classRoom={classRoom}
                profileImg={profileImg}
            >
                <div className="flex mt-6">
                    <h1 className="mx-auto text-2xl">
                        {selectedLanguage === "eng"
                            ? "place the tiles “apples” corresponding to the numbers"
                            : "Inserisci le tessere “mela” che corrispondono ai numeri"}
                    </h1>
                </div>
                <div className="relative flex flex-row justify-center gap-x-20 md:h-[55vh] lg:h-[60vh] w-full z-10">
                    <div className="flex flex-col justify-center h-full w-[45%] mt-4 ml-4 mr-4">
                        <h1 className="mx-auto text-xl  mb-4 text-grayText">
                            Smarter 1
                        </h1>
                        <div className="grid grid-cols-5 justify-items-center gap-y-4 gap-x-4 h-full">
                            {lvlDataLeft.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-200 w-full flex justify-center items-center text-8xl"
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
                                                  isCorrectLeft[index]
                                                      ? "border-green-500"
                                                      : ""
                                              } ${
                                                  isWrongLeft[index]
                                                      ? "border-red-500"
                                                      : ""
                                              }`
                                            : ``
                                    } w-full flex justify-center items-center text-8xl`}
                                >
                                    {/* <input
                                        className="text-6xl text-center w-20"
                                        name={index}
                                        onChange={handleInputChangeLeft}
                                    ></input> */}
                                    <div
                                        className="text-6xl text-center w-20"
                                        name={index}
                                    >{inputValuesLeft?.[index]}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-700 w-0 h-[60vh] mt-10"></div>

                    <div className="flex flex-col justify-center h-full w-[45%] mt-4 ml-4 mr-4">
                        <h1 className="mx-auto text-xl mb-4 text-grayText">
                            Smarter 2
                        </h1>
                        <div className="grid grid-cols-5 justify-items-center gap-y-4 gap-x-4 h-full">
                            {lvlDataRight.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-200 border-4 w-full flex justify-center items-center text-8xl"
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
                                                  isCorrectRight[index]
                                                      ? "border-green-500"
                                                      : ""
                                              } ${
                                                  isWrongRight[index]
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
                                    >{inputValuesRight?.[index]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Image
                    src={leone}
                    alt="leone"
                    width={120}
                    className="fixed bottom-6 left-40"
                ></Image>
            </LayoutGames>
        </>
    );
}
