import LayoutGames from "@/components/LayoutGames";
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import _ from "lodash";
import Swal from "sweetalert2";

export const getServerSideProps = async ({ req, res }) => {
    const FEEDBACK = process.env.FEEDBACK;
    const url = process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

        const user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: "Bearer " + session.accessToken,
            },
        });
        // console.log(user.data.SelectedClass);

        //Fetch classroom data
        const classData = await axios({
            method: "get",
            url: url + "/classroom/getClassroomData/" + user.data.SelectedClass,
            headers: {
                Authorization: "Bearer " + session.accessToken,
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
}) {
    const router = useRouter();
    const { levelGame2, game } = router.query; //game = quantita or ordinamenti

    const [subLvl, setsubLvl] = useState(0);
    const [lvlData, setLvlData] = useState([]); //Used to check the correct solution
    //const [lvlDataShuffled, setLvlDataShuffled] = useState([]); //Used to display the data
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

    //Get level data
    useEffect(() => {
        axios
            .get(url + "/games/" + game + "/hpi/" + levelGame2, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                // console.log(res.data);
                setLvlData(res.data[subLvl]);
                // const data = _.shuffle(res.data[subLvl]);
                // setLvlDataShuffled(data);
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
        for (let i = 0; i < lvlData.length; i++) {
            if (inputValues[i] == lvlData[i]) {
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

    //Handle next level
    useEffect(() => {
        if (isCorrect.every((el) => el === true)) {
            if (subLvl < 4) {
                Swal.fire({
                    title: "CORRETTO!",
                    color: "#ff7100",
                    html: "Esercizio " + (subLvl + 1) + "/5 completato",
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
                Swal.fire({
                    title: "COMPLIMENTI!",
                    color: "#ff7100",
                    html: "Livello " + levelGame2 + " completato",
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
                    levelGame2,
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            // console.log(res);
            router.push("/mockup/gamification");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <LayoutGames classRoom={classRoom} title={game} liv={levelGame2}>
                <div className="relative flex flex-col justify-center h-screen max-h-[550px] mt-10 ml-4 mr-4 z-10">
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
                                }  w-full flex justify-center items-center text-8xl`}
                            >
                                <input
                                    className="text-xl w-20"
                                    name={index}
                                    onChange={handleInputChange}
                                ></input>
                            </div>
                        ))}
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
