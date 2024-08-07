import LayoutGames from "@/components/LayoutGames";
import Link from "next/link";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
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
                classRoom: classData.data,
                isIndividual: user.data.IsIndividual,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Badge({
    classRoom,
    profileImg,
    badgeData,
    badgeImg,
    isIndividual,
}) {
    const router = useRouter();
    const { title, liv, name } = router.query;

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
                title={title}
                liv={liv}
                profileImg={profileImg}
            >
                <div className="relative flex flex-col mx-auto items-center h-[70vh] w-full sm:mt-10 md:mt-28 lg:mt-28 z-10">
                    <div className="flex flex-row items-center justify-center gap-x-10 px-32 bg-slate-200 rounded-xl shadow-2xl">
                        <div className="w-52 h-52 mx-auto bg-slate-200 mt-10 mb-10">
                            <Image
                                src={procioneBadgeCompleted}
                                alt="badge image"
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="flex flex-col items-center self-center gap-y-6">
                            <h1 className="text-grayText text-2xl">
                                {selectedLanguage === "eng"
                                    ? "CONGRATULATIONS!"
                                    : "CONGRATULAZIONI!"}
                            </h1>
                            <h1 className="text-grayText text-2xl">
                                {selectedLanguage === "eng"
                                    ? "YOU HAVE EARNED A NEW BADGE:"
                                    : isIndividual
                                    ? "HAI VINTO UN NUOVO BADGE:"
                                    : "AVETE VINTO UN NUOVO BADGE:"}
                            </h1>
                            <h1 className="text-orangeBtn text-3xl">
                                {name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex mt-10 sm:mt-6 gap-x-6">
                        <button className="py-3 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./attivita">
                                {selectedLanguage === "eng"
                                    ? "GAMES"
                                    : "GIOCHI"}
                            </Link>
                        </button>
                        <button className="py-3 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./profilo">
                                {selectedLanguage === "eng"
                                    ? "PROFILE"
                                    : "PROFILO"}
                            </Link>
                        </button>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
