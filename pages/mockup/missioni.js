import { useState } from "react";
import LayoutGames from "../../components/LayoutGames";
import Badge from "../../components/Badge";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import PopUp from "@/components/settingsPopUp";

export default function BadgePage() {
    const [showPopUp, setShowPopUp] = useState(false);

    //Toggle settings popup
    function togglePopUp() {
        setShowPopUp(!showPopUp);
    }

    return (
        <>
            <LayoutGames>
                <header>
                    <nav>
                        <div className="flex flex-row justify-between bg-blue-600 shadow-2xl h-auto py-2">
                            <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                                LE QUANTITA' - LIVELLO X
                            </h1>
                            <div className="flex flex-row items-center">
                                <h1 className="text-4xl text-slate-100 mr-4">
                                    CLASSE_1^A
                                </h1>
                                <div className="mr-6 bg-slate-400 bg-opacity-50 rounded-lg transition ease-in-out hover:bg-slate-500 hover:-translatey-1 hover:scale-110 shadow-2xl duration-300">
                                    <button onClick={togglePopUp}>
                                        <DensityMediumIcon
                                            className="text-slate-100 text-opacity-80 text-5xl ml-1 mr-1 mt-1 mb-1"
                                            fontSize="large"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>

                <div className="flex flex-col mx-auto h-[70%] w-1/2 bg-slate-200 rounded-xl shadow-2xl mt-10">
                    <h1 className="mx-auto text-4xl text-orangeBtn mt-6">
                        BADGE
                    </h1>

                    <div className="overflow-auto h-full">
                        <Badge />
                        <Badge />
                        <Badge />
                        <Badge />
                        <Badge />
                    </div>

                    <div className="flex justify-center gap-x-4 mb-4 h-[20%] w-full">
                        <button className="self-end h-[50%] w-[20%] transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            SFIDE
                        </button>
                        <button className="self-end h-[50%] w-[20%] transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            PROFILO
                        </button>
                    </div>
                </div>

                <PopUp show={showPopUp} onClose={togglePopUp}></PopUp>
            </LayoutGames>
        </>
    );
}
