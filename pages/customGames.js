import LayoutSelezioneGiochi from "@/components/LayoutSelezioneGiochi.js";
import { useRouter } from "next/router";
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { useState } from "react";

export async function getServerSideProps({ req, res }) {
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

        // Fetch classrooms on Page Load
        const bearer_token = "Bearer " + token.accessToken;
        const gamesData = await axios({
            method: "get",
            url: url + "/games/getGamesData",
            headers: {
                Authorization: bearer_token,
            },
        });
        // console.log(gamesData.data);

        return {
            props: {
                token: session.accessToken,
                url: process.env.BACKEND_URI,
                gamesData: gamesData.data,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
}

export default function CustomGames({ token, url, gamesData }) {
    const router = useRouter();
    // console.log(gamesData.Quantita[0][0]); //lpi, lvl=1

    const [selectedLvlLPI, setSelectedLvlLPI] = useState(0);

    const handleLevelLPIChange = (event) => {
        setSelectedLvlLPI(parseInt(event.target.value));
    };

    if (router.query.game === "quantita") {
        //QUANTITA
        return (
            <>
                <LayoutSelezioneGiochi
                    title="PERSONALIZZA GIOCHI - QUANTITA'"
                    prevPath={router.query.prevPath}
                >
                    <div className="flex flex-row justify-center gap-x-96 mt-10">
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-3xl mb-4">LPI</h1>
                            <select
                                value={selectedLvlLPI}
                                onChange={handleLevelLPIChange}
                            >
                                <option value={0}>Livello 1</option>
                                <option value={1}>Livello 2</option>
                                <option value={2}>Livello 3</option>
                            </select>
                                {gamesData.Quantita[0][selectedLvlLPI].map(
                                    (item, index) => {
                                        return (
                                            <div key={index} className="flex flex-row mt-4">
                                                <p className="w-14">Es. {index} {item}</p>
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <input type="text" className="ml-4 w-14" />
                                                ))}
                                            </div>
                                        );
                                    }
                                )}
                            <button className="mt-6 bg-orangeBtn w-1/2 rounded-md py-1">CONFERMA</button>
                        </div>
                        <div className="flex flex-col">
                            <h1>HPI</h1>
                        </div>
                    </div>
                </LayoutSelezioneGiochi>
            </>
        );
    } else {
        //ORDINAMENTI
        return (
            <>
                <LayoutSelezioneGiochi
                    title="PERSONALIZZA GIOCHI - ORDINAMENTI"
                    prevPath={router.query.prevPath}
                ></LayoutSelezioneGiochi>
            </>
        );
    }
}
