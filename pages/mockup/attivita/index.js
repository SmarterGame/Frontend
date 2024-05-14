import LayoutSelezioneGiochi from "@/components/LayoutSelezioneGiochi";
import Image from "next/image";
import montagna from "@/public/montagnaSMARTER.png";
import leftArrow from "@/public/leftArrow.svg";
import rightArrow from "@/public/rightArrow.svg";
import orsoFaccia from "@/public/orsoFaccia.png";
import procioneFaccia from "@/public/procioneFaccia.png";
import grass from "@/public/grass.png";
import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import Levels from "@/components/AttivitaLevels";
import { useEffect, useState } from "react";
import { useHasHydrated } from "@/utils/hooks";

export const getServerSideProps = async ({ req, res }) => {
    // const url = "http://" + process.env.BACKEND_URI;
    const url = process.env.INTERNAL_BACKEND_URI;
    try {
        let token;
        try {
            token = await getAccessToken(req, res);
        }
        catch (err) {
            return { 
                redirect: {
                    permanent: false,
                    destination: "/api/auth/login",
                },
                props: {}
            };
        }
        const bearer_token = "Bearer " + token.accessToken;

        //Fetch id of selected classroom
        let user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: bearer_token,
            },
        });
        if (user.data.IsIndividual === true) user.data.SelectedMode = "3";
        //console.log(user.data);

        //Fetch profile image
        const profileImg = await axios({
            method: "get",
            url: url + "/user/profileImg",
            headers: {
                Authorization: bearer_token,
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

        const games = await axios({
            method: "get",
            url: url + "/games?limit=2&mode=" + user.data.SelectedMode,
            headers: {
                Authorization: bearer_token,
            },
        });

        console.log({
            token: token.accessToken,
            url: process.env.BACKEND_URI,
            classRoom: classData.data,
            selectedMode: user.data.SelectedMode,
            profileImg: imageUrl,
            games: games.data,
            maxPages: games.data.meta.numPages
        })

        return {
            props: {
                token: token.accessToken,
                url: process.env.BACKEND_URI,
                classRoom: classData.data,
                selectedMode: user.data.SelectedMode,
                profileImg: imageUrl,
                games: games.data,
                maxPages: games.data.meta.numPages
            },
        };
    } catch (err) {
        console.log("error")
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Giochi({ classRoom, selectedMode, profileImg, games, maxPages, url, token }) {
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [loadedGames, setLoadedGames] = useState(games.data ?? []);
    const [currentPage, setCurrentPage] = useState(games.meta.page);
    const isHydrated = useHasHydrated();
    
    useEffect(() => {
        setSelectedLanguage(sessionStorage.getItem("language"));
    }, []);

    const nextGamePage = async (right) => {
        const nextPage = right ? currentPage+1 : currentPage-1;
        const games = (await axios({
            method: "get",
            url: url + "/games?limit=2&page="+ nextPage + "&mode=" + selectedMode,
            headers: {
                Authorization: "Bearer " + token,
            },
        })).data;
        setCurrentPage(nextPage);
        setLoadedGames(games.data);
    };

    console.log(loadedGames)

    const title = selectedLanguage === "eng" ? "GAMES" : "GIOCHI";

    if (!isHydrated) {
        return null;
    }

    return (
        <>
            <Image
                src={montagna}
                alt="montagna"
                className="absolute bottom-0 left-[16vw] w-[65vw] h-[75vh]"
            />
            <div 
                className="cursor-pointer"
                hidden={currentPage == 1}
                onClick={() => {
                    nextGamePage(false)
                }}
            >
                <Image
                    src={leftArrow}
                    alt="left arrow"
                    className="absolute top-[33vh] left-[1vw] w-[50px] h-[50px]"
                />
            </div>
            <div
                className="cursor-pointer"
                hidden={currentPage >= maxPages}
                onClick={() => {
                    nextGamePage(true)
                }}
            >
                <Image
                    src={rightArrow}
                    alt="right arrow"
                    className="absolute top-[33vh] right-[1vw] w-[50px] h-[50px]"
                />
            </div>
            
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
                                key={0}
                                gameId={loadedGames[0]?._id}
                                classRoom={classRoom}
                                selectedMode={selectedMode}
                                title={loadedGames[0].name}
                                levels={loadedGames[0].levels ?? []}
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
                                key={1}
                                gameId={loadedGames[1]?._id}
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
