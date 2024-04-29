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

        const games = await axios({
            method: "get",
            url: url + "/games?limit=2",
            headers: {
                Authorization: token,
            },
        });

        return {
            props: {
                token: token,
                url: url,
                classRoom: classData.data,
                selectedMode: user.data.SelectedMode,
                profileImg: imageUrl,
                games: games.data
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Giochi({ classRoom, selectedMode, profileImg, games, url, token }) {
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [loadedGames, setLoadedGames] = useState(games.data);
    const [nextPage, setNextPage] = useState((games.meta.page == games.meta.numPages) ? 1 : (1+games.meta.page));
    useEffect(() => {
        setSelectedLanguage(sessionStorage.getItem("language"));
    }, []);

    const nextGamePage = async () => {
        const games = (await axios({
            method: "get",
            url: url + "/games?limit=2&page="+ nextPage,
            headers: {
                Authorization: token,
            },
        })).data;
        setNextPage((games.meta.page == games.meta.numPages) ? 1 : (1+games.meta.page));
        setLoadedGames(games.data);
    };

    const title = selectedLanguage === "eng" ? "GAMES" : "GIOCHI";

    return (
        <>
            <Image
                src={montagna}
                alt="montagna"
                className="absolute bottom-0 left-[16vw] w-[65vw] h-[75vh]"
            />
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
                    <div className="flex flex-row items-center justify-between h-full w-[95%]" id="test">
                        {loadedGames.length === 0 && (<div>No Games...</div>)}
                        {loadedGames.length > 0 && (
                            <Levels
                                classRoom={classRoom}
                                selectedMode={selectedMode}
                                title={loadedGames[0].name}
                                levels={loadedGames[0].levels}
                                left={true}
                            >
                                <Image
                                    src={procioneFaccia}
                                    alt="procione faccia"
                                    width={90}
                                />
                            </Levels>
                        )}

                        {loadedGames.length > 1 && (
                            <Levels
                                levels={loadedGames[1].levels}
                                selectedMode={selectedMode}
                                title={loadedGames[1].name}
                                left={false}
                            >
                                <Image
                                    src={orsoFaccia}
                                    alt="orso faccia"
                                    width={80}
                                />
                            </Levels>
                        )}
                    </div>
                    <button onClick={nextGamePage}>cliccami</button>
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
