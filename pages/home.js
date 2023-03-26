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

export const getServerSideProps = async ({ req, res }) => {
    const url = "http://" + process.env.BACKEND_URI;
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
        console.log(tiles.data);
        return {
            props: { token: session.accessToken, url: url, tiles: tiles.data },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Home({ token, url, tiles }) {
    const { user, isLoading } = useUser();
    const [classroom_tiles, setClassroom_tiles] = useState([]); //Array of TeamBox
    const [showPopUp, setShowPopUp] = useState(false);

    useEffect(() => {
        if (tiles) {
            setClassroom_tiles([...tiles]);
        }
    }, []);

    //Toggle settings popup
    function togglePopUp() {
        setShowPopUp(!showPopUp);
    }

    //Add a new classroom
    const addBoxHandler = async (url) => {
        const { value: newName } = await Swal.fire({
            title: "Create a New Class",
            input: "text",
            inputPlaceholder: "Name the class",
            showCancelButton: true,
            closeOnCancel: true,
            confirmButtonColor: "#ff7100",
            cancelButtonColor: "#575757",
            confirmButtonText: "Create",
        });
        if (newName) {
            console.log(url);
            try {
                const newClass = await axios({
                    method: "get",
                    url: url + "/classroom/add/" + newName,
                    headers: { Authorization: "Bearer " + token },
                });
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
                <button onClick={togglePopUp}>
                    <SettingsOutlinedIcon
                        className="text-slate-100 text-opacity-80 text-5xl ml-1 mr-1 mt-1 mb-1"
                        fontSize="large"
                    />
                </button>
            </div>

            <PopUp show={showPopUp} onClose={togglePopUp}></PopUp>
        </LayoutLogin>
    );
}
