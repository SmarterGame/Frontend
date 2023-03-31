import { useState } from "react";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import PopUp from "@/components/settingsPopUp";
import SideBar from "@/components/SideBar";
import Link from "next/link";

export default function HeaderProfile({ token, url, boxes }) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);

    //Toggle settings popup
    function togglePopUp() {
        setShowPopUp(!showPopUp);
    }

    return (
        <>
            <header>
                <nav>
                    <div className="flex flex-row justify-between bg-blue-600 shadow-2xl h-auto py-2">
                        <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                            PROFILO
                        </h1>
                        <div className="flex flex-row items-center">
                            <h1 className="text-4xl text-slate-100 mr-4">
                                CLASSE_1^A
                            </h1>
                            <div className="mr-6 bg-slate-400 bg-opacity-50 rounded-lg transition ease-in-out hover:bg-slate-500 hover:-translatey-1 hover:scale-110 shadow-2xl duration-300">
                                <button
                                    onClick={() => {
                                        setShowSideBar(!showSideBar);
                                    }}
                                >
                                    <DensityMediumIcon
                                        className="text-slate-100 text-opacity-80 text-5xl ml-1 mr-1 mt-1 mb-1"
                                        fontSize="large"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <SideBar show={showSideBar}>
                        <button
                            onClick={() => {
                                setShowSideBar(!showSideBar);
                            }}
                            className="h-10 w-52 transition ease-in-out bg-gray-500 hover:bg-gray-600 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300"
                        >
                            X CHIUDI
                        </button>
                        <button
                            onClick={togglePopUp}
                            className="h-10 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300"
                        >
                            SELEZIONA SMARTER
                        </button>
                        <button className="h-10 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300">
                            <Link href="/home">CAMBIA CLASSE</Link>
                        </button>
                    </SideBar>
                </nav>
                <PopUp show={showPopUp} onClose={togglePopUp} boxes={boxes} token={token} url={url} />
                <div
                    className={`${
                        showPopUp ? "modal display-block" : "modal display-none"
                    } transition-transform duration-300 fixed inset-0`}
                ></div>
            </header>
        </>
    );
}
