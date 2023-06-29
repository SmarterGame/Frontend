import LayoutSelezioneGiochi from "@/components/LayoutSelezioneGiochi";
import Image from "next/image";
import montagna from "@/public/montagnaSMARTER.png";
import orsoFaccia from "@/public/orsoFaccia.png";
import procioneFaccia from "@/public/procioneFaccia.png";
import grass from "@/public/grass.png";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import Levels from "@/components/AttivitaLevels";
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
        let user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: token,
            },
        });
        if (user.data.IsIndividual === true) user.data.SelectedMode = "3";
        //console.log(user.data);

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

        //Fetch classroom data
        let classData;
        //Load individual data if user is individual
        if (user.data.IsIndividual) {
            classData = await axios({
                method: "get",
                url:
                    url + "/individual/getData/" + user.data.SelectedIndividual,
                headers: {
                    Authorization: token,
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
                    Authorization: token,
                },
            });
            // console.log(classData.data);
        }

        return {
            props: {
                token: session.accessToken,
                url: url,
                classRoom: classData.data,
                selectedMode: user.data.SelectedMode,
                profileImg: imageUrl,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Giochi({ classRoom, selectedMode, profileImg }) {
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

    const titleLeft = selectedLanguage === "eng" ? "QUANTITIES" : "QUANTITA'";
    const titleRight =
        selectedLanguage === "eng" ? "ARRANGE THE NUMBERS" : "ORDINAMENTI";
    const title = selectedLanguage === "eng" ? "GAMES" : "GIOCHI";

    return (
        <>
            <LayoutSelezioneGiochi
                classRoom={classRoom}
                title={title}
                pageAttivita={true}
                profileImg={profileImg}
            >
                <div className="flex flex-col items-center mx-auto h-[82vh] max-w-[95%] bg-slate-200 rounded-xl shadow-2xl mt-4">
                    <h1 className="mt-6 text-4xl text-orangeBtn">
                        {selectedLanguage === "eng"
                            ? "CHOOSE A GAME"
                            : "SCEGLI UN GIOCO"}
                    </h1>
                    <div className="flex flex-row items-center justify-center h-full">
                        <Levels
                            classRoom={classRoom}
                            selectedMode={selectedMode}
                            title={titleLeft}
                            left={true}
                        >
                            <Image
                                src={procioneFaccia}
                                alt="procione faccia"
                                width={90}
                            />
                        </Levels>

                        <Image
                            src={montagna}
                            alt="montagna"
                            width={900}
                            className="translate-y-12 sm:w-[40%] md:w-[50%] lg:w-[65%]"
                        />

                        <Levels
                            classRoom={classRoom}
                            selectedMode={selectedMode}
                            title={titleRight}
                            left={false}
                        >
                            <Image
                                src={orsoFaccia}
                                alt="orso faccia"
                                width={80}
                            />
                        </Levels>
                    </div>
                </div>

                <Image
                    src={grass}
                    alt="erba"
                    className="absolute sm:-bottom-10 md:bottom-0 lg:bottom-0 w-full"
                />
            </LayoutSelezioneGiochi>
        </>
    );
}
