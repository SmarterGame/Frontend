import LayoutGames from "@/components/LayoutGames";
import Image from "next/image";
import Link from "next/link";
import ghianda from "@/public/ghianda.svg";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import procioneBadgeCompleted from "@/public/procioneBadgeCompleted.svg"

export const getServerSideProps = async ({ req, res }) => {

    const url = process.env.INTERNAL_BACKEND_URI;
    try {
        let token;

        try {
            token = await getAccessToken(req, res);
        }
        catch (err) {
            console.log(err);
            return { 
                redirect: {
                    permanent: false,
                    destination: "/api/auth/login",
                },
                props: {}
            };
        }

        const bearer_token = "Bearer " + token.accessToken;

        const user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: bearer_token,
            },
        });
        // console.log(user.data.SelectedClass);

        //Fetch classroom data
        let classData;
        //Load individual data if user is individual
        if (user.data.IsIndividual) {
            classData = await axios({
                method: "get",
                url:
                    url + "/individual/getData/" + user.data.SelectedIndividual,
                headers: {
                    Authorization: bearer_token,
                },
            });
            // console.log(classData.data);
        } else {
            classData = await axios({
                method: "get",
                url:
                    url +
                    "/classroom/getClassroomData/" +
                    user.data.SelectedClass,
                headers: {
                    Authorization: bearer_token,
                },
            });
            // console.log(classData.data);
        }

        return {
            props: {
                token: token.accessToken,
                url: process.env.BACKEND_URI,
                selectedClass: user.data.SelectedClass,
                classRoom: classData.data,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Quantita({
    token,
    url,
    classRoom,
    profileImg,
    badgesImg = [],
}) {
    const router = useRouter();
    const { game, level, badgeData, expPoints } = router.query;

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

    return (
        <>
            <LayoutGames
                classRoom={classRoom}
                profileImg={profileImg}
                title={game}
                liv={level}
            >
                <div className="relative flex flex-col mx-auto w-1/2 min-w-[700px] bg-slate-200 rounded-xl shadow-2xl mt-4 z-10">
                    <div className="flex flex-col items-center h-full mt-6">
                        <h1 className="text-4xl text-orangeBtn">
                            {game}
                            -{selectedLanguage === "eng" ? "LEVEL" : "LIVELLO"}{" "}
                            {level}
                        </h1>
                        <h2 className="text-2xl text-slate-700 mt-6">
                            {selectedLanguage === "eng" ? "ACORNS" : "GHIANDE"}
                        </h2>

                        <div className="flex flex-row items-center gap-x-2 mt-4">
                            <p className="text-xl text-slate-700 mt-6">X</p>
                            <h1 className=" text-6xl text-slate-700 ml-1">
                                {expPoints}
                            </h1>
                            <Image src={ghianda} alt="ghianda" width={80} />
                        </div>

                        <div className="mx-auto bg-slate-300 h-1 w-[60%] mt-6 rounded-full"></div>

                        <h1 className="text-2xl text-slate-700 mt-6">BADGE</h1>
                        <div className="flex flex-row gap-x-6 mt-4">
                            {[...new Set(badgeData)].map((badge, index) => (
                                <button key={index}>
                                    <Link
                                        href={`/mockup/badge?title=${game}&liv=${level}&name=${badge}`} alt={badge}
                                    >
                                        <Image
                                            src={procioneBadgeCompleted}
                                            alt="badge image"
                                            width={150}
                                            height={150}
                                        />
                                    </Link>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-row justify-center gap-x-4 w-full mt-6 mb-6">
                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] py-3 rounded-md duration-300">
                                <Link href="./attivita">
                                    {selectedLanguage === "eng"
                                        ? "GAMES"
                                        : "GIOCHI"}
                                </Link>
                            </button>

                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] py-3 rounded-md duration-300">
                                <Link href="./profilo">
                                    {selectedLanguage === "eng"
                                        ? "PROFILE"
                                        : "PROFILO"}
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
