import LayoutGames from "@/components/LayoutGames";
import HeaderGames from "@/components/HeaderGames";
import Head from "next/head";
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSmarter } from "@/data/mqtt/hooks";
import leone from "@/public/leone.svg";
import Image from "next/image";

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
            url: url + "/user/me?query=smarter",
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

        const gameInstance = await axios
            .post(url+"/games/"+gameId+"/instances", {
                mqttBroker: "ssl://ib05a168.ala.us-east-1.emqxsl.com:8883",
                mqttUser: "smarter",
                mqttPassword: "melaC-melaV",
                mqttSmarter: user.data.SelectedSmarters[0].name,
                entityId: classData.data._id,
                mode: user.data.SelectedMode
            }, {
                headers: {
                    Authorization: token,
                },
            })
        

        return {
            props: {
                token: session.accessToken,
                url: url,
                selectedClass: user.data.SelectedClass,
                selectedSmarters: user.data.SelectedSmarters,
                classRoom: classData.data,
                FEEDBACK: FEEDBACK,
                profileImg: imageUrl,
                game: game.data,
                level: level,
                gameInstance: gameInstance.data
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        const customError = {
            error: JSON.stringify(err, Object.getOwnPropertyNames(err)),
            debug: {
                name: err?.name,
                headers: JSON.parse(JSON.stringify(err?.config?.headers, Object.getOwnPropertyNames(err?.config?.headers))),
                method: err?.config?.method,
                url: err?.config?.url,
                data: err?.config?.data ?? "",
                stack: err?.stack,
                respDate: err?.response?.data
            }
        }
        return { props: { 
            err: customError
        } };
    }
};

function SingleGui({
    FEEDBACK,
    assignment,
    lvlData,
    isCorrect,
    inputValues,
    selectedSmarters
}) {
    return (
        <>
            <div className="flex mt-6">
                <h1 className="mx-auto text-2xl">
                    {assignment}
                </h1>
            </div>
            <div className="relative flex flex-col justify-center md:h-[55vh] lg:h-[60vh] mt-10 ml-4 mr-4 z-10">
                <div className={(lvlData.length <= 5 ? "flex flex-col items-center w-full " : "") + "h-full"}>
                    <div className={"grid grid-cols-"+ lvlData.length+" justify-items-center gap-y-4 gap-x-" + (lvlData.length > 5 ? "4" : "14") + " h-full "+ (lvlData.length > 5 ? "" : "w-[65%]")}>
                        {lvlData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-slate-200 w-full flex justify-center items-center text-8xl col-span-1 row-span-1 overflow-hidden"
                            >
                                {item}
                            </div>
                        ))}
                        {Array.from({ length: lvlData.length }, (_, index) => (
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
        </>
    )
}

function SeparatedGui({
    FEEDBACK,
    assignment,
    lvlData,
    isCorrect,
    inputValues,
    selectedSmarters
}) {
    return (
        <>
            <div className="flex mt-6">
                <h1 className="mx-auto text-2xl">
                    {assignment}
                </h1>
            </div>
            <div className="relative flex flex-row justify-center gap-x-20 md:h-[55vh] lg:h-[60vh] w-full z-10">
                {selectedSmarters.map((_, smarterIndex) => (
                    <>
                        <div className="flex flex-col justify-center h-full w-[45%] mt-4 ml-4 mr-4">
                            <h1 className="mx-auto text-xl  mb-4 text-grayText">
                                Smarter {smarterIndex+1}
                            </h1>
                            <div className="grid grid-cols-5 justify-items-center gap-y-4 gap-x-4 h-full">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="bg-slate-200 w-full flex justify-center items-center text-8xl"
                                    >
                                        {lvlData[i+5*smarterIndex]}
                                    </div>
                                ))}
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`bg-slate-200 border-4 ${
                                            FEEDBACK === "true"
                                                ? `${
                                                        isCorrect[i+5*smarterIndex]
                                                            ? "border-green-500"
                                                            : ""
                                                    } ${
                                                        isWrong[i+5*smarterIndex]
                                                            ? "border-red-500"
                                                            : ""
                                                    }`
                                                : ``
                                        } w-full flex justify-center items-center text-8xl`}
                                    >
                                        <div
                                            className="text-8xl text-center w-20"
                                            name={i}
                                        >{inputValues?.[i+5*smarterIndex]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {(smarterIndex < selectedSmarters.length-1) && (<div className="border-2 border-dashed border-gray-700 w-0 h-[60vh] mt-10"></div>)}
                    </>
                ))}
            </div>
            <Image
                src={leone}
                alt="leone"
                width={120}
                className="fixed bottom-6 left-40"
            ></Image>
        </>
    )
}

export default function Game({
    token,
    url,
    selectedClass,
    selectedSmarters = [],
    classRoom,
    FEEDBACK,
    profileImg,
    game,
    level,
    err
}) {
    const router = useRouter();
    //const { gameId, level } = router.query; //game = quantita or ordinamenti
    const mode = game?.levels[+level-1].mode;
    // TODO: prendi i dati degli smarter dalle informazioni utente quindi userData.SelectedSmarter -> [{name: string}]
    // da quell'array posso cavarmi fuori i dati di quanti smarter sono collegati e di conseguenza modulare l'interfaccia grafica
    const {events, sendAction} = useSmarter({smarterIds: selectedSmarters?.map(smarter => smarter.name) ?? []});
    const [error, setError] = useState(false);
    const [currentExe, setCurrentExe] = useState(0);
    const [lvlDataCorrect, setLvlDataCorrect] = useState(game?.levels[+level-1]?.exercises?.[currentExe]?.endSeq?.map(item => item === "_" ? "" : item) ?? []);
    const [lvlData, setLvlData] = useState(game?.levels[+level-1]?.exercises?.[currentExe]?.startSeq?.map(item => item === "_" ? "" : item) ?? []); //Used to check the correct solution
    const [inputValues, setInputValues] = useState(new Array(selectedSmarters?.length*5).map(() => "")); //Used to store the input values
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
    useEffect(() => {
        //sendAction(LED_WHITE_ACTION)
        setLvlData(game?.levels[+level-1]?.exercises?.[currentExe]?.startSeq?.map(item => item === "_" ? "" : item) ?? []);
        const inputs = document.querySelectorAll("input[name]");
        inputs.forEach((input) => {
            input.value = "";
        });
        setIsCorrect([false, false, false, false, false]);
        setInputValues(new Array(selectedSmarters.length*5).map(() => "") ?? []);
    }, [currentExe]);

    //Check if the solution is correct
    useEffect(() => {
        console.log(inputValues);
        console.log(lvlDataCorrect);
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
            if (currentExe < game?.levels[+level-1]?.exercises?.length-1) {
                const title =
                    selectedLanguage === "eng" ? "CORRECT!" : "CORRETTO!";
                const html =
                    selectedLanguage === "eng"
                        ? "Exercise " + (currentExe + 1) + "/" + game?.levels[+level-1]?.exercises?.length + "completed"
                        : "Esercizio " + (currentExe + 1) + "/" + game?.levels[+level-1]?.exercises?.length + "completato";

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
                        const ce = currentExe+1;
                        setLvlData(game?.levels[+level-1]?.exercises?.[ce]?.startSeq?.map(item => item === "_" ? "" : item) ?? ['x','x','x','x','x'])
                        setLvlDataCorrect(game?.levels[+level-1]?.exercises?.[ce]?.endSeq?.map(item => item === "_" ? "" : item) ?? ['x','x','x','x','x']);
                        setCurrentExe((prevState) => prevState + 1);
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

                // sendAction(LED_GREEN_ACTION);
                // sendAction(LED_GREEN_ACTION);

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
                        // sendAction(LED_BLUE_ACTION);
                        // sendAction(LED_BLUE_ACTION);
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
            const copy_events = [...events];
            const result = Object.groupBy(copy_events, ({ smarter_id }) => smarter_id);
            
            setInputValues((prev) => {
                let copy = [...prev]
                selectedSmarters.forEach((smarter, index) => {
                    console.log(result[smarter.name]);
                    const msg = result[smarter.name]
                    if (msg && msg.length > 0) {
                        msg[msg.length-1]?.payload?.forEach((value, sindex) => {
                            copy[sindex+5*index] = value;
                        })
                    }
                })
                return copy ?? ['' * selectedSmarters.length]
            } );
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

    if (err) {
        const styles = {
            backgroundColor: "#c4e5ff",
            backgroundImage: "url(/grass.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "bottom",
        };

        return (
            <>
                <Head>
                    <title>SmartGame</title>
                </Head>

                <main style={styles}>
                    <div className="min-h-[100vh] min-w-[100vh]">
                        <HeaderGames
                            title={"error"}
                        />
                        <div className="flex items-center justify-center h-full w-full p-10">
                            <div className="flex flex-col gap-4 max-w-[75%] break-words">
                                <div className="text-4xl">Scusaci, abbiamo un problema tecnico. Prova a ricaricare la pagina</div>
                                <div className="flex flex-col border-4 border-black bg-white p-4 font-sans max-h-[50vh] overflow-y-scroll">
                                    <div >{JSON.stringify(err.debug, null, 4)}</div>
                                    <div>{err.error}</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </main>
            </>
        )
    }

    if (!game) {
        return null;
    }

    return (   
        <>
            <LayoutGames
                classRoom={classRoom}
                title={game?.name}
                liv={level}
                profileImg={profileImg}
            >
                {mode == 2 ? (
                    <SeparatedGui 
                        FEEDBACK={FEEDBACK} 
                        assignment={game?.levels[+level-1]?.exercises?.[currentExe]?.assignment} 
                        lvlData={lvlData} 
                        isCorrect={isCorrect} 
                        inputValues={inputValues} 
                        selectedSmarters={selectedSmarters}
                    />
                ) : (
                    <SingleGui 
                        FEEDBACK={FEEDBACK} 
                        assignment={game?.levels[+level-1]?.exercises?.[currentExe]?.assignment} 
                        lvlData={lvlData} 
                        isCorrect={isCorrect} 
                        inputValues={inputValues} 
                        selectedSmarters={selectedSmarters}
                    />
                )}
                
            </LayoutGames>
        </>
    );
}
