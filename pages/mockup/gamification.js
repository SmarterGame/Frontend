import LayoutGames from "@/components/LayoutGames";
import Image from "next/image";
import Link from "next/link";
import ghianda from "@/public/ghianda.svg";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import url2 from "url";

export const getServerSideProps = async ({ req, res }) => {
    //Get badge id from url
    const { query } = url2.parse(req.url, true);
    const badgeEarned = JSON.parse(query.badgeData ?? "[]");
    // console.log(JSON.parse(query.badgeData ?? "[]"));

    const url = process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);

        const token = "Bearer " + session.accessToken;

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

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

        //Fetch classroom data
        const classData = await axios({
            method: "get",
            url: url + "/classroom/getClassroomData/" + user.data.SelectedClass,
            headers: {
                Authorization: token,
            },
        });
        // console.log(classData.data);

        //Fetch badge image
        let badgesImg = [];
        for (const badgeId of badgeEarned) {
            const badgeImg = await axios({
                method: "get",
                url: url + "/badge/getImg/" + badgeId,
                headers: {
                    Authorization: token,
                },
                responseType: "arraybuffer",
            });
            const image = Buffer.from(badgeImg.data, "binary").toString(
                "base64"
            );
            const badgeImageUrl = `data:image/jpeg;base64,${image}`;
            badgesImg.push(badgeImageUrl);
        }

        return {
            props: {
                token: session.accessToken,
                url: url,
                selectedClass: user.data.SelectedClass,
                classRoom: classData.data,
                profileImg: imageUrl,
                badgesImg: badgesImg,
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
    const { game, level, badgeData } = router.query; //game = quantita or ordinamenti
    const idBadgeEarned = JSON.parse(badgeData ?? "[]");

    let gameType = 0;
    if (game == "quantita") gameType = 1;

    useEffect(() => {
        //Get badge data from id
        const getBadge = async () => {
            try {
                const badge = await axios({
                    method: "get",
                    url: url + "/badge/" + idBadgeEarned,
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                // console.log(badge.data);
            } catch (err) {
                console.log(err);
            }
        };
        getBadge();
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
                            {gameType ? "LE QUANTITA'" : "GLI ORDINAMENTI"} -
                            LIVELLO {level}
                        </h1>
                        <h2 className="text-2xl text-slate-700 mt-6">
                            GHIANDE
                        </h2>

                        <div className="flex flex-row items-center gap-x-2 mt-4">
                            <p className="text-xl text-slate-700 mt-6">X</p>
                            <h1 className=" text-6xl text-slate-700 ml-1">
                                {level}
                            </h1>
                            <Image src={ghianda} alt="ghianda" width={80} />
                        </div>

                        <div className="mx-auto bg-slate-300 h-1 w-[60%] mt-6 rounded-full"></div>

                        <h1 className="text-2xl text-slate-700 mt-6">BADGE</h1>
                        <div className="flex flex-row gap-x-6 mt-4">
                            {idBadgeEarned.map((badge, index) => (
                                <button key={badge}>
                                    <Link
                                        href={`/mockup/badge?title=${game}&id=${badge}`}
                                    >
                                        {badgesImg.length > 0 ? (
                                            <Image
                                                src={badgesImg[index]}
                                                alt="badge image"
                                                width={150}
                                                height={150}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </Link>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-row justify-center gap-x-4 w-full mt-6 mb-6">
                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] py-3 rounded-md duration-300">
                                <Link href="./attivita">GIOCHI</Link>
                            </button>

                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] py-3 rounded-md duration-300">
                                <Link href="./profilo">PROFILO</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
