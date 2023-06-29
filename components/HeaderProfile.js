import { useState, useEffect } from "react";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import PopUp from "@/components/settingsPopUp";
import SideBar from "@/components/SideBar";
import Link from "next/link";

export default function HeaderProfile({
    token,
    url,
    boxes,
    classRoom,
    selectedOptions,
    isIndividual,
}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);

    console.log(isIndividual);

    // const selectedLanguage = getSelectedLanguage();
    const [selectedLanguage, setSelectedLanguage] = useState();

    const className = classRoom.ClassName;

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

    //Toggle settings popup
    function togglePopUp() {
        setShowPopUp(!showPopUp);
    }

    const toggleSideBar = () => {
        setShowSideBar(!showSideBar);
    };

    return (
        <>
            <header>
                <div className="flex flex-row justify-between bg-blue-600 shadow-2xl py-2">
                    <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                        {selectedLanguage === "eng" ? " PROFILE" : "PROFILO"}
                    </h1>
                    <div className="flex flex-row items-center">
                        <h1 className="text-4xl text-slate-100 mr-4">
                            {isIndividual
                                ? ""
                                : selectedLanguage === "eng"
                                ? "CLASS "
                                : "CLASSE "}
                            {className}
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
                <SideBar
                    token={token}
                    url={url}
                    show={showSideBar}
                    onClose={toggleSideBar}
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
                            onClick={togglePopUp}
                            className="mx-auto text-gray-600 text-xl"
                        >
                            {selectedLanguage === "eng"
                                ? "SELECT SMARTERs"
                                : "SELEZIONA SMARTER"}
                        </button>
                    </div>
                    <div className="flex w-full py-2 px-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md">
                        <button className="mx-auto text-gray-600 text-xl">
                            <Link href="/home">
                                {selectedLanguage === "eng"
                                    ? "CHANGE CLASS"
                                    : "CAMBIA CLASSE"}
                            </Link>
                        </button>
                    </div>
                </SideBar>
                <PopUp
                    show={showPopUp}
                    onClose={togglePopUp}
                    boxes={boxes}
                    token={token}
                    url={url}
                    classId={classRoom._id}
                    selectedOptions={selectedOptions}
                />
                <div
                    className={`${
                        showPopUp ? "modal display-block" : "modal display-none"
                    } transition-transform duration-300 fixed inset-0 z-40`}
                ></div>
            </header>
        </>
    );
}
