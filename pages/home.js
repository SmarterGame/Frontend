import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";
import LayoutLogin from "../components/LayoutLogin";
import Swal from "sweetalert2";
import TeamBox from "../components/TeamBox";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PopUp from "@/components/settingsPopUp";
import SideBar from "@/components/SideBar";

export const getServerSideProps = async ({ req, res }) => {
    // const url = "http://" + process.env.BACKEND_URI;
    const url = process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

        // Fetch classrooms on Page Load
        const token = "Bearer " + session.accessToken;
        const tiles = await axios({
            method: "get",
            url: url + "/classroom/all",
            headers: {
                Authorization: token,
            },
        });
        //console.log(tiles.data);

        //Fetch boxes on Page Load
        const boxes = await axios({
            method: "get",
            url: url + "/box/all",
            headers: {
                Authorization: token,
            },
        });
        // console.log(boxes.data);

        return {
            props: {
                token: session.accessToken,
                url: url,
                tiles: tiles.data,
                boxes: boxes.data,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Home({ token, url, tiles, boxes }) {
    console.log("url: " + url);
    const { user, isLoading } = useUser();
    const [classroom_tiles, setClassroom_tiles] = useState([]); //Array of TeamBox
    const [showPopUp, setShowPopUp] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const [popupData, setPopupData] = useState(null);

    useEffect(() => {
        if (tiles) {
            setClassroom_tiles([...tiles]);
        }
    }, []);

    //Toggle settings popup
    const togglePopUp = (id) => {
        setShowPopUp(!showPopUp);
        setPopupData(id);
    };

    //Add a new classroom
    const addBoxHandler = async (url) => {
        const { value: newName } = await Swal.fire({
            title: "Crea una nuova classe",
            input: "text",
            inputPlaceholder: "Nome della classe",
            showCancelButton: true,
            closeOnCancel: true,
            confirmButtonColor: "#ff7100",
            cancelButtonColor: "#575757",
            confirmButtonText: "Crea",
            cancelButtonText: "Annulla",
        });
        if (newName) {
            // console.log(url);
            try {
                const newClass = await axios({
                    method: "get",
                    url: url + "/classroom/add/" + newName,
                    headers: { Authorization: "Bearer " + token },
                });
                // console.log(newClass.data);
                setClassroom_tiles([...classroom_tiles, newClass.data]);
            } catch (err) {
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

    //Add a smarter to the user
    async function addSmarter() {
        const { value: smarterId, dismiss } = await Swal.fire({
            title: "Inserisci id smarter",
            input: "text",
            inputPlaceholder: "id smarter",
            confirmButtonColor: "#ff7100",
            showCancelButton: true,
            confirmButtonText: "Aggiungi",
            cancelButtonText: "Annulla",
        });

        //Check if annulla is pressed
        if (dismiss === Swal.DismissReason.confirm) {
            //Check if the id is empty
            if (smarterId) {
                const result = await axios({
                    method: "get",
                    url: url + "/box/add/" + smarterId,
                    headers: { authorization: "Bearer " + token },
                });

                console.log(result.data);
                setTimeout(() => {
                    return -1;
                }, 1000);

                //Check if api returns an error
                if (result.data.error) {
                    Swal.fire({
                        title: "Errore",
                        text: result.data.message,
                        icon: "error",
                        confirmButtonColor: "#ff7100",
                        confirmButtonText: "Ok",
                    });
                } else {
                    Swal.fire({
                        title: "Successo",
                        text: result.data.message,
                        icon: "success",
                        confirmButtonColor: "#ff7100",
                        confirmButtonText: "Ok",
                    });
                }
            } else {
                Swal.fire({
                    title: "Errore",
                    text: "Inserisci un id valido",
                    icon: "error",
                    confirmButtonColor: "#ff7100",
                    confirmButtonText: "Ok",
                });
            }
        }
    }

    return (
        <LayoutLogin user={user} loading={isLoading}>
            <div className="flex flex-col items-center w-full py-10">
                <h1 className="text-7xl text-gray-100 text-stroke-orange mb-14 transition ease-in-out hover:-translatey-1 hover:scale-110 duration-300">
                    SMART GAME
                </h1>

                {classroom_tiles.map((element) => {
                    return (
                        <TeamBox
                            key={element._id}
                            classroomData={element}
                            removeHandler={removeBoxHandler}
                            togglePopUp={() => togglePopUp(element._id)}
                        />
                    );
                })}

                <div className="flex justify-center items-center mt-6">
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

            <SideBar show={showSideBar}>
                <button
                    onClick={() => {
                        setShowSideBar(!showSideBar);
                    }}
                    className="h-10 w-52 transition ease-in-out bg-gray-500 hover:bg-gray-600 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300"
                >
                    X Chiudi
                </button>
                <button
                    onClick={addSmarter}
                    className="h-10 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300"
                >
                    Aggiungi smarter
                </button>
            </SideBar>

            <PopUp
                show={showPopUp}
                onClose={togglePopUp}
                classId={popupData}
                boxes={boxes}
                token={token}
                url={url}
            />
            <div
                className={`${
                    showPopUp ? "modal display-block" : "modal display-none"
                } transition-transform duration-300 fixed inset-0`}
            ></div>
        </LayoutLogin>
    );
}
