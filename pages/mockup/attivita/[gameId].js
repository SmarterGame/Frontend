import LayoutGames from "@/components/LayoutGames";
import HeaderGames from "@/components/HeaderGames";
import Head from "next/head";
import axios from "axios";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSmarter } from "@/data/mqtt/hooks";
import leone from "@/public/leone.svg";
import Image from "next/image";
import mele1 from "@/public/mele1.svg";
import mele2 from "@/public/mele2.svg";
import mele3 from "@/public/mele3.svg";
import mele4 from "@/public/mele4.svg";
import mele5 from "@/public/mele5.svg";
import mele6 from "@/public/mele6.svg";
import mele7 from "@/public/mele7.svg";
import mele8 from "@/public/mele8.svg";
import mele9 from "@/public/mele9.svg";
import mele10 from "@/public/mele10.svg";

const meleSvgs = [
    mele1,
    mele2,
    mele3,
    mele4,
    mele5,
    mele6,
    mele7,
    mele8,
    mele9,
    mele10
]

export const getServerSideProps = async ({ req, res, query }) => {
    const FEEDBACK = process.env.FEEDBACK;
    const url = process.env.INTERNAL_BACKEND_URI;
    try {
        const {gameId, level = 1} = query;

        let token;
        try {
            token = await getAccessToken(req, res);
        }
        catch (err) {
            return { 
                redirect: {
                    permanent: false,
                    destination: "/api/auth/login",
                },
                props: {}
            };
        }
        const bearer_token = "Bearer " + token.accessToken;
        
        let user = await axios({
            method: "get",
            url: url + "/user/me?query=smarter",
            headers: {
                Authorization: bearer_token,
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
                Authorization: bearer_token,
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

        let classData;
        if (user.data.IsIndividual) {
            classData = await axios({
                method: "get",
                url: url + "/individual/getData/" + user.data.SelectedIndividual,
                headers: {
                    Authorization: bearer_token,
                },
            });
        } else {
            classData = await axios({
                method: "get",
                url: url + "/classroom/getClassroomData/" + user.data.SelectedClass,
                headers: {
                    Authorization: bearer_token,
                },
            });
        }
        
        // console.log(classData.data);

        const game = await axios
            .get(url + "/games/" + gameId, {
                headers: {
                    Authorization: bearer_token,
                },
            })

        const gameInstance = await axios
            .post(url+"/games/"+gameId+"/instances", {
                mqttBroker: process.env.MQTT_URI.replace(),
                mqttUser: process.env.MQTT_USER,
                mqttPassword: process.env.MQTT_PSW,
                mqttSmarters: user.data.SelectedSmarters.map(s => s.name),
                mqttMode: (user.data.SelectedMode == 1 ? "COLLABORATIVE" : "INDIVIDUAL"),
                entityId: classData.data._id,
                mode: user.data.SelectedMode,
                currentGameLevel: level,
                classLvl: classData.data.ClassLvl,
                expPoints: +classData.data.Ghiande,
                currentBadges: classData.data.ObtainedBadges
            }, {
                headers: {
                    Authorization: bearer_token,
                },
            })
        

        return {
            props: {
                token: token.accessToken,
                url: process.env.BACKEND_URI,
                selectedMode: user.data.SelectedMode,
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
                headers: JSON.parse(JSON.stringify(err?.config?.headers, Object.getOwnPropertyNames(err?.config?.headers ?? {})) ?? "{}"),
                method: err?.config?.method ?? "",
                url: err?.config?.url ?? "",
                data: err?.config?.data ?? "",
                stack: err?.stack,
                respDate: err?.response?.data ?? ""
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
    inputTypes,
    selectedSmarters,
    cardType = "numbers"
}) {
    function getCardComponent(index, data, assignment = true) {
        const value = data?.[index];

        console.log(index);
        console.log(value);

        if (value === undefined || (cardType === "mela" && value > 10)) 
            return <div
                className="text-8xl text-center w-20"
                name={index}
            ></div>


        const currentCardType = assignment ? cardType : inputTypes[index];
        
        switch(currentCardType) {
            case "numero":
                return <div
                    className="text-8xl text-center w-20"
                    name={index}
                >{value}</div>
            case "mela":
                return <Image
                    src={meleSvgs[value-1]}
                    alt="mele"
                ></Image>
            default:
                return <div
                    className="text-8xl text-center w-20"
                    name={index}
                ></div>
        }
    }
    return (
        <>
            <div className="flex mt-6">
                <h1 className="mx-auto text-2xl">
                    {assignment}
                </h1>
            </div>
            <div className="relative flex flex-col justify-center md:h-[55vh] lg:h-[60vh] mt-10 ml-4 mr-4 z-10">
                <div className={(lvlData.length <= 5 ? "flex flex-col items-center w-full " : "") + "h-full"}>
                    <div className={"grid grid-cols-"+lvlData.length+" grid-rows-2 justify-items-center gap-y-4 gap-x-" + (lvlData.length > 5 ? "4" : "14") + " h-full "+ (lvlData.length > 5 ? "" : "w-[65%]")}>
                        {lvlData.map((_, index) => (
                            <div
                                key={index}
                                className="bg-slate-200 w-full flex justify-center items-center text-8xl col-span-1 row-span-1 overflow-hidden"
                            >
                                {getCardComponent(index, lvlData)}
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
                                {getCardComponent(index, inputValues, false)}
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
    inputTypes,
    selectedSmarters,
    cardType = "numbers"
}) {
    function getCardComponent(index, data, assignment = true) {
        const value = data?.[index];

        console.log(value);

        if (value === undefined || (cardType === "mela" && value > 10)) 
            return <div
                className="text-8xl text-center w-20"
                name={index}
            ></div>

        const currentCardType = assignment ? cardType : inputTypes[index];

        switch(currentCardType) {
            case "numero":
                return <div
                    className="text-8xl text-center w-20"
                    name={index}
                >{value}</div>
            case "mela":
                return <Image
                    src={meleSvgs[value-1]}
                    alt="mele"
                ></Image>
            default:
                return <div
                    className="text-8xl text-center w-20"
                    name={index}
                ></div>
        }
    }


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
                            <div className="grid grid-cols-5 grid-rows-2 justify-items-center gap-y-4 gap-x-4 h-full">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="bg-slate-200 w-full flex justify-center items-center text-8xl"
                                    >
                                        {getCardComponent(i+5*smarterIndex, lvlData)}
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
                                        } w-full flex justify-center items-center text-8xl h-full`}
                                    >
                                        {getCardComponent(i+5*smarterIndex, inputValues, false)}
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
    selectedMode,
    selectedSmarters = [],
    classRoom,
    FEEDBACK,
    profileImg,
    game,
    level,
    gameInstance,
    err
}) {
    console.log(game);
    const router = useRouter();
    //const { gameId, level } = router.query; //game = quantita or ordinamenti
    const mode = game?.levels.filter(l => l?.mode == selectedMode )[+level-1].mode;
    // TODO: prendi i dati degli smarter dalle informazioni utente quindi userData.SelectedSmarter -> [{name: string}]
    // da quell'array posso cavarmi fuori i dati di quanti smarter sono collegati e di conseguenza modulare l'interfaccia grafica
    const {events, gui, sendAction} = useSmarter({smarterIds: selectedSmarters?.map(smarter => smarter.name) ?? []});
    const [error, setError] = useState(false);
    const [currentExe, setCurrentExe] = useState(0);
    const [lvlDataCorrect, setLvlDataCorrect] = useState(game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.endSeq?.map(item => item === "_" ? "" : item) ?? []); //Used to check the correct solution
    const [lvlData, setLvlData] = useState(game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.startSeq?.map(item => item === "_" ? "" : item) ?? []);
    const [inputValues, setInputValues] = useState(new Array(selectedSmarters?.length*5).map(() => "")); //Used to store the input values
    const [inputTypes, setInputTypes] = useState(new Array(selectedSmarters?.length*5).map(() => ""));
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
        setLvlData(game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.startSeq?.map(item => item === "_" ? "" : item) ?? []);
        const inputs = document.querySelectorAll("input[name]");
        inputs.forEach((input) => {
            input.value = "";
        });
        setIsCorrect([false, false, false, false, false]);
        setInputValues(new Array(selectedSmarters.length*5).map(() => "") ?? []);
    }, [currentExe]);

    //Check if the solution is correct
    useEffect(() => {
        console.log(lvlData);
        console.log(inputValues);
        console.log(lvlDataCorrect);
        const cardType = game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.cardType;
        const correctArray = [];
        const wrongArray = [];
        for (let i = 0; i < lvlData.length; i++) {
            if (cardType === inputTypes[i] && inputValues[i] == lvlDataCorrect[i]) {
                correctArray.push(true);
                wrongArray.push(false);
                // setIsCorrect((prevState) => {
                //     const newState = [...prevState];
                //     newState[i] = true;
                //     return newState;
                // });
                // setIsWrong((prevState) => {
                //     const newState = [...prevState];
                //     newState[i] = false;
                //     return newState;
                // });
            } else {
                // setIsCorrect((prevState) => {
                //     const newState = [...prevState];
                //     newState[i] = false;
                //     return newState;
                // });
                correctArray.push(false);
                if (inputValues[i] != undefined && inputValues[i] != "") {
                    console.log("inputvalue")
                    console.log(inputValues[i])
                    wrongArray.push(true);
                    // setIsWrong((prevState) => {
                    //     const newState = [...prevState];
                    //     newState[i] = true;
                    //     return newState;
                    // });
                } else {
                    wrongArray.push(false);
                }
            }

            setIsCorrect(correctArray);
            setIsWrong(wrongArray);

            //If input is empty set isCorrect and isWrong to false
            // if (inputValues[i] == "" && ) {
            //     setIsCorrect((prevState) => {
            //         const newState = [...prevState];
            //         newState[i] = false;
            //         return newState;
            //     });
            //     setIsWrong((prevState) => {
            //         const newState = [...prevState];
            //         newState[i] = false;
            //         return newState;
            //     });
            // }
            console.log(isCorrect)
            console.log(isWrong)
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
        let newExecNum = undefined;

        if (gui.type == "next_exec") {
            newExecNum = gui.value;
        }

        console.log(newExecNum);
        console.log(currentExe);
        if (isCorrect.every((el) => el === true) || +newExecNum == currentExe+1) {
            axios({
                method: "post",
                url: url + "/games/"+ game._id + "/instances/" + gameInstance._id + "/increaseExecNum",
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                console.log(res.data);
            }).catch((err) => {
                console.log(err)
            });
            if (currentExe < game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.length-1) {
                const title =
                    selectedLanguage === "eng" ? "CORRECT!" : "CORRETTO!";
                const html =
                    selectedLanguage === "eng"
                        ? "Exercise " + (currentExe + 1) + "/" + game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.length + "completed"
                        : "Esercizio " + (currentExe + 1) + "/" + game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.length + "completato";

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
                        setLvlData(game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[ce]?.startSeq?.map(item => item === "_" ? "" : item) ?? ['x','x','x','x','x'])
                        setLvlDataCorrect(game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[ce]?.endSeq?.map(item => item === "_" ? "" : item) ?? ['x','x','x','x','x']);
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
    }, [isCorrect, gui]);

    useEffect(() => {
        console.log(isWrong)
        if (isWrong.some((el) => el === true)) {
            // TODO: add error to current exercise
            axios({
                method: "post",
                url: url + "/games/"+ game._id + "/instances/" + gameInstance._id + "/increaseExecError",
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                console.log(res.data);
            }).catch((err) => {
                console.log(err)
            });
        }
    }, [isWrong])

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

            setInputTypes((prev) => {
                let copy = [...prev]
                selectedSmarters.forEach((smarter, index) => {
                    console.log(result[smarter.name]);
                    const msg = result[smarter.name]
                    if (msg && msg.length > 0) {
                        msg[msg.length-1]?.payloadTypes?.forEach((value, sindex) => {
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
            const res = await axios({
                method: "POST",
                url:
                    url +
                    "/games/" + gameInstance.gameId + "/instances/" + gameInstance._id + "/stop",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            gameInstance = res.data;
            
            router.push({
                pathname: "/mockup/gamification",
                query: {
                    game: game?.name,
                    badgeData: gameInstance?.obtainedBadges?.map(b => b?.badgeName)?.filter(b => !classRoom.ObtainedBadges.map(ba => ba.name).includes(b)),
                    expPoints: +gameInstance?.currentExpPoints - gameInstance?.originalExpPoints,
                    level: gameInstance?.currentGameLevel,
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
                        assignment={game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.assignment} 
                        lvlData={lvlData} 
                        isCorrect={isCorrect} 
                        inputValues={inputValues} 
                        inputTypes={inputTypes}
                        selectedSmarters={selectedSmarters}
                        cardType={game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.cardType}
                    />
                ) : (
                    <SingleGui 
                        FEEDBACK={FEEDBACK} 
                        assignment={game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.assignment} 
                        lvlData={lvlData} 
                        isCorrect={isCorrect} 
                        inputValues={inputValues}
                        inputTypes={inputTypes}
                        selectedSmarters={selectedSmarters}
                        cardType={game?.levels.filter(l => l?.mode == selectedMode )[+level-1]?.exercises?.[currentExe]?.cardType}
                    />
                )}
                
            </LayoutGames>
        </>
    );
}
