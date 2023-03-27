import { useState } from "react";
import Link from "next/link";
import LayoutProfile from "../../components/LayoutProfile";
import Badge from "../../components/Badge";
import PopUp from "@/components/settingsPopUp";

export default function BadgePage() {
    const [showPopUp, setShowPopUp] = useState(false);

    //Toggle settings popup
    function togglePopUp() {
        setShowPopUp(!showPopUp);
    }

    return (
        <>
            <LayoutProfile>
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
                            <Link href="./attivita">GIOCHI</Link>
                        </button>
                        <button className="self-end h-[50%] w-[20%] transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./profilo">PROFILO</Link>
                        </button>
                    </div>
                </div>

                <PopUp show={showPopUp} onClose={togglePopUp}></PopUp>
            </LayoutProfile>
        </>
    );
}
