import { useState, useEffect, use } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getAccessToken, getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import LayoutLogin from "@/components/LayoutLogin";
import Swal from "sweetalert2";
import TeamBox from "@/components/TeamBox";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PopUp from "@/components/settingsPopUp";
import SideBar from "@/components/SideBar";
import AddSmarter from "@/components/AddSmarter";
import Link from "next/link";
import { useRouter } from 'next/router'

export const getServerSideProps = withPageAuthRequired({
    // returnTo: '/unauthorized',
    async getServerSideProps({ req, res }) {
        // const url = "http://" + process.env.BACKEND_URI;
        const url = process.env.BACKEND_URI;
        try {
            const session = await getSession(req, res);
    
            // EXIT if the session is null (Not Logged)
            if (session == null) {
                console.log("Early return");
                return { props: {error: "REFRESH"} };
            }

            let token;
            try {
                token = await getAccessToken(req, res)
            } catch (err) {
                return {props: {error: "REFRESH"}};
            }
    
            // Fetch classrooms on Page Load
            const bearer_token = "Bearer " + token.accessToken;
            const user = await axios({
                method: "get",
                url: url + "/user/me",
                headers: {
                    Authorization: bearer_token,
                },
            });
          
            // console.log(user.data.SelectedMode);
    
            const tiles = await axios({
                method: "get",
                url: url + "/classroom/all",
                headers: {
                    Authorization: bearer_token,
                },
            });
            //console.log(tiles.data);
    
            //Fetch boxes on Page Load
            const boxes = await axios({
                method: "get",
                url: url + "/box/all",
                headers: {
                    Authorization: bearer_token,
                },
            });    
            
            const selectedSmarters = []
            user.data.SelectedSmarters.forEach(value => {
                const filtered = boxes.data.filter((box) => box._id == value)
                if (filtered.length > 0) {
                    selectedSmarters.push(filtered[0].name);
                }
            })
            const selectedOptions = {
                selectedSmarters: selectedSmarters,
                selectedMode: user.data.SelectedMode,
            };
            
            return {
                props: {
                    token: token.accessToken,
                    url: url,
                    tiles: tiles.data,
                    boxes: boxes.data,
                    selectedOptions: selectedOptions,
                    userBoxes: user.data.Boxes,
                },
            };
        } catch (err) {
            console.log(err);
            console.log(url);
            return { props: {error: err.message} };
        }
    }
});

export default function Home({
    token,
    url,
    tiles,
    boxes,
    selectedOptions,
    userBoxes,
    error
}) {
    const { user, isLoading } = useUser();
    const [classroom_tiles, setClassroom_tiles] = useState([]); //Array of TeamBox
    const [showPopUp, setShowPopUp] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const [showAddSmarter, setShowAddSmarter] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const router = useRouter();

    const [selectedLanguage, setSelectedLanguage] = useState();

    if (typeof window !== 'undefined' && error === "REFRESH") {
        router.push("/api/auth/login")
        return null;
    }

    useEffect(() => {
        if (tiles) {
            setClassroom_tiles([...tiles]);
        }
    }, []);

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

    if (error && error !== "REFRESH") {
        Swal.fire({
            icon: "error",
            title: error,
        })
    }

    //Toggle settings popup
    const togglePopUp = (id) => {
        setShowPopUp(!showPopUp);
        setPopupData(id);
    };

    const toggleSideBar = () => {
        setShowSideBar(!showSideBar);
    };

    const toggleAddSmarter = () => {
        setShowAddSmarter(!showAddSmarter);
    };

    //Add a new classroom
    const addBoxHandler = async (url) => {
        const title =
            selectedLanguage == "eng"
                ? "Create a new classroom"
                : "Crea una nuova classe";
        const inputPlaceholder =
            selectedLanguage == "eng" ? "Classroom name" : "Nome della classe";
        const confirmButtonText = selectedLanguage == "eng" ? "Create" : "Crea";
        const cancelButtonText =
            selectedLanguage == "eng" ? "Cancel" : "Annulla";

        const { value: newName } = await Swal.fire({
            title: title,
            input: "text",
            inputPlaceholder: inputPlaceholder,
            showCancelButton: true,
            closeOnCancel: true,
            confirmButtonColor: "#ff7100",
            cancelButtonColor: "#575757",
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
        });
        if (newName) {
            try {
                const newClass = await axios({
                    method: "get",
                    url: url + "/classroom/add/" + newName,
                    headers: { Authorization: "Bearer " + token },
                });
                // console.log(newClass.data);
                setClassroom_tiles([...classroom_tiles, newClass.data]);
                const title =
                    selectedLanguage == "eng"
                        ? "Class created!"
                        : "Classe creata!";
                Swal.fire({
                    title: title,
                    icon: "success",
                    confirmButtonColor: "#ff7100",
                });
            } catch (err) {
                const title =
                    selectedLanguage == "eng"
                        ? "Error creating class"
                        : "Errore creazione classe";
                Swal.fire({
                    title: title,
                    icon: "error",
                    confirmButtonColor: "#ff7100",
                });
                console.log(err);
            }
        }
    };

    //Remove a classroom
    const removeBoxHandler = async (id) => {
        const newClass = await axios({
            method: "get",
            url: url + "/classroom/remove/" + id,
            headers: { Authorization: "Bearer " + token },
        });
        let tileCopy = [...classroom_tiles],
            pos = tileCopy.findIndex((element) => element._id == id);
        tileCopy.splice(pos, 1);
        setClassroom_tiles([...tileCopy]);
    };

    //Rename a classroom
    const renameBoxHandler = async (id, newName) => {
        await axios({
            method: "post",
            url: url + "/classroom/rename/" + id + "/" + newName,
            headers: { Authorization: "Bearer " + token },
        });
        let tileCopy = [...classroom_tiles],
            pos = tileCopy.findIndex((element) => element._id == id);
        tileCopy[pos].ClassName = newName;
        setClassroom_tiles([...tileCopy]);
    };

    if (!user)
        return (
            <>
                <LayoutLogin user={user} loading={isLoading}>
                    <div className="flex flex-col">
                        <h1 className="text-3xl">
                            {selectedLanguage === "eng"
                                ? "Login to continue"
                                : "Effettua il login"}
                        </h1>
                        <button className="transition ease-in-out delay-150 bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-xl font-bold shadow-2xl mt-5 mb-2 px-4 py-2 rounded-md duration-300">
                            <Link href="/api/auth/login">
                                {selectedLanguage === "eng"
                                    ? "Login"
                                    : "Accedi"}
                            </Link>
                        </button>
                    </div>
                </LayoutLogin>
            </>
        );

    return (
        <LayoutLogin user={user} loading={isLoading}>
            <div className="flex flex-col items-center self-start h-full w-full py-10">
                <h1 className="text-7xl text-gray-100 text-stroke-orange mb-14 transition ease-in-out hover:-translatey-1 hover:scale-110 duration-300">
                    SMART GAME
                </h1>

                {classroom_tiles.map((element) => {
                    return (
                        <TeamBox
                            key={element._id}
                            classroomData={element}
                            removeHandler={removeBoxHandler}
                            renameHandler={renameBoxHandler}
                            togglePopUp={() => togglePopUp(element._id)}
                        />
                    );
                })}

                <div className="flex justify-center items-center">
                    <button
                        className="transition ease-in-out rounded-full w-14 h-14 bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 shadow-2xl duration-300"
                        onClick={() => addBoxHandler(url)}
                    >
                        <AddIcon fontSize="large" />
                    </button>
                </div>
            </div>

            <div className="absolute top-5 right-5 bg-slate-400 bg-opacity-50 rounded-lg transition ease-in-out hover:bg-slate-500 hover:-translatey-1 hover:scale-110 shadow-2xl duration-300">
                <button
                    onClick={() => {
                        setShowSideBar(!showSideBar);
                    }}
                >
                    <SettingsOutlinedIcon
                        className="text-slate-100 text-opacity-80 text-5xl ml-1 mr-1 mt-1 mb-1"
                        fontSize="large"
                    />
                </button>
            </div>

            <SideBar
                show={showSideBar}
                onClose={toggleSideBar}
                token={token}
                url={url}
            >
                {/* <div className="flex w-full py-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md">
                    <button
                        onClick={() => {
                            setShowSideBar(!showSideBar);
                        }}
                        className="mx-auto text-gray-600 text-xl"
                    >
                        CHIUDI
                    </button>
                </div> */}
                <div className="flex w-full py-2 px-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md">
                    <button
                        onClick={toggleAddSmarter}
                        className="mx-auto text-gray-600 text-lg"
                    >
                        {selectedLanguage === "eng"
                            ? "ADD SMARTER"
                            : "AGGIUNGI SMARTER"}
                    </button>
                </div>
            </SideBar>

            <PopUp
                token={token}
                url={url}
                show={showPopUp}
                onClose={togglePopUp}
                classId={popupData}
                boxes={boxes}
                userBoxes={userBoxes}
                selectedOptions={selectedOptions}
            />

            <AddSmarter
                token={token}
                url={url}
                show={showAddSmarter}
                onClose={toggleAddSmarter}
                boxes={boxes}
                userBoxes={userBoxes}
            />

            <div
                className={`${
                    showPopUp ? "modal display-block" : "modal display-none"
                } transition-transform duration-300 fixed inset-0`}
            ></div>
        </LayoutLogin>
    );
}
