import LayoutProfile from "@/components/LayoutProfile";
import Image from "next/image";
import Link from "next/link";
import ghianda from "@/public/ghianda.svg";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import ProfileImg from "@/components/ProfileImg";
import ProgressBar from "@/components/ProgressBar";
import { useEffect, useState } from "react";

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
        const token = "Bearer " + session.accessToken;

        //Fetch id of selected classroom
        const user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: token,
            },
        });
        // console.log(user.data.SelectedClass);

        //Fetch profile image
        const profileImg = await axios({
            method: "get",
            url: url + "/user/profileImg",
            headers: {
                Authorization: token,
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

        //Fetch boxes on Page Load
        const boxes = await axios({
            method: "get",
            url: url + "/box/all",
            headers: {
                Authorization: token,
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
      //  console.log("ECCC: "+boxes.data);

        //Fetch classroom data
        let individualData;
        //Load individual data if user is individual
        if (user.data.IsIndividual) {
            individualData = await axios({
                method: "get",
                url:
                    url + "/individual/getData/" + user.data.SelectedIndividual,
                headers: {
                    Authorization: token,
                },
            });
            // console.log(classData.data);
        }

        const classData = await axios({
            method: "get",
            url:
                url +
                "/classroom/getClassroomData/" +
                user.data.SelectedClass,
            headers: {
                Authorization: token,
            },
        });

        return {
            props: {
                token: session.accessToken,
                url: url,
                user: user.data,
                boxes: boxes.data,
                individual: individualData?.data ?? null,
                classRoom: classData?.data ?? null,
                selectedOptions: selectedOptions,
                profileImg: imageUrl,
                isIndividual: user.data.IsIndividual,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Profilo({
    token,
    url,
    boxes,
    user,
    classRoom = { Ghiande: 0, Exp: 0 },
    individual,
    selectedOptions,
    profileImg,
    isIndividual,
}) {
    // const selectedLanguage = getSelectedLanguage();
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

    const lvlNamesIta = ["Boyscout", "Avventuriero", "Esperto", "Ranger"];
    const lvlNamesEng = ["Boyscout", "Adventurer", "Expert", "Ranger"];

    const numGhiande = isIndividual ? individual.Ghiande : classRoom.Ghiande;
    const classLvl = isIndividual ? individual.ClassLvl: classRoom.ClassLvl;

    return (
        <>
            <LayoutProfile
                token={token}
                url={url}
                userBoxes={user.Boxes}
                boxes={boxes}
                individual={individual}
                classRoom={classRoom}
                selectedOptions={selectedOptions}
                isIndividual={isIndividual}
            >
                <div className="relative flex flex-col mx-auto w-1/2 min-w-[700px] bg-slate-200 rounded-xl shadow-2xl mt-8 mb-4 z-20">
                    <div className="relative">
                        <h1 className="absolute top-8 right-32 text-3xl text-slate-700">
                            x {numGhiande}
                        </h1>
                        <Image
                            src={ghianda}
                            alt="ghianda"
                            width={60}
                            className="absolute top-4 right-14 z-0"
                        />
                    </div>

                    <div className="w-40 h-40 mx-auto border-4 border-orangeBtn rounded-full mt-6 shadow-xl">
                        <ProfileImg
                            profileImg={profileImg}
                            classRoomId={classRoom._id}
                        />
                    </div>

                    <ProgressBar lv={classLvl} ghiande={numGhiande} />

                    <div className="flex flex-col items-center">
                        <h1 className=" text-orangeBtn text-4xl mt-8">
                            {selectedLanguage === "eng" ? "Level" : "Livello"}{" "}
                            {classLvl}{" "}
                            {selectedLanguage === "eng"
                                ? lvlNamesEng[classLvl - 1]
                                : lvlNamesIta[classLvl - 1]}
                        </h1>
                        <div className="flex flex-col h-full mt-8 mb-10 gap-y-6">
                            <button className=" mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-56 h-14 rounded-md duration-300">
                                <Link href="./missioni">
                                    {selectedLanguage === "eng"
                                        ? "BADGES"
                                        : "BADGE"}
                                </Link>
                            </button>
                            <button className="mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-56 h-14 rounded-md duration-300">
                                <Link href="./attivita">
                                    {selectedLanguage === "eng"
                                        ? "GAMES"
                                        : "GIOCHI"}
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutProfile>
        </>
    );
}
