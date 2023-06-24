import Image from "next/image";
import ghianda from "@/public/ghianda.png";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import ProfileImg from "@/components/ProfileImg";
import { useEffect, useState } from "react";

export default function HeaderGames({
    loading,
    title = "",
    classRoom = { Ghiande: 0 },
    pageAttivita = false,
    prevPath = false,
    liv,
    profileImg,
}) {
    const numGhiande = classRoom.Ghiande;

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

    let tmp = false;
    if (title === "quantita") {
        if (selectedLanguage === "eng") title = "QUANTITIES";
        else title = "LE QUANTITA'";
        tmp = true;
    } else if (title === "ordinamenti") {
        if (selectedLanguage === "eng") title = "ARRANGE THE NUMBERS";
        else title = "GLI ORDINAMENTI";
        tmp = true;
    }

    return (
        <>
            <header>
                <nav>
                    <div className="flex flex-row justify-between bg-blue-600 shadow-2xl py-2">
                        <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                            {tmp
                                ? title +
                                  " - " +
                                  (selectedLanguage === "eng"
                                      ? "LEVEL "
                                      : "LIVELLO ") +
                                  liv
                                : title}
                        </h1>
                        <div className="flex flex-row items-center mr-4">
                            <h1 className="text-4xl text-slate-100 mr-4">
                                {numGhiande}
                            </h1>
                            <Image
                                src={ghianda}
                                width={60}
                                alt="ghianda"
                            ></Image>
                            <div className="w-20 h-20 border-2 border-orangeBtn rounded-full ml-4 mr-4 hover:scale-110 transition">
                                <Link href="/mockup/profilo">
                                    <ProfileImg
                                        profileImg={profileImg}
                                        classRoomId={classRoom._id}
                                    />
                                </Link>
                            </div>
                            <div className="bg-red-500 bg-opacity-50 rounded-lg transition ease-in-out hover:bg-red-600 hover:bg-opacity-50 hover:-translatey-1 hover:scale-110 shadow-2xl duration-300">
                                <button>
                                    <Link
                                        href={`${
                                            pageAttivita
                                                ? "/mockup/profilo"
                                                : prevPath
                                                ? prevPath
                                                : "/mockup/attivita"
                                        }`}
                                    >
                                        <ClearIcon
                                            className="text-red-700 text-opacity-80 text-5xl ml-1 mr-1 mt-1 mb-1"
                                            fontSize="large"
                                        />
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
