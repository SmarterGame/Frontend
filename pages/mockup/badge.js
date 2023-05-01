import LayoutGames from "@/components/LayoutGames";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import ProfileImg from "@/components/ProfileImg";
import { useRouter } from "next/router";
import url2 from "url";
import Image from "next/image";

export const getServerSideProps = async ({ req, res }) => {
    //Get badge id from url
    const { query } = url2.parse(req.url, true);
    const idBadgeEarned = query.id ?? null;

    const url = process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

        const token = "Bearer " + session.accessToken;

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

        //Fetch badge data
        const badgeData = await axios({
            method: "get",
            url: url + "/badge/getBadge/" + idBadgeEarned,
            headers: {
                Authorization: token,
            },
        });
        console.log(badgeData.data);

        //Fetch badge image
        const badgeImg = await axios({
            method: "get",
            url: url + "/badge/getImg/" + idBadgeEarned,
            headers: {
                Authorization: token,
            },
            responseType: "arraybuffer",
        });
        const image = Buffer.from(badgeImg.data, "binary").toString("base64");
        const badgeImageUrl = `data:image/jpeg;base64,${image}`;

        return {
            props: {
                token: session.accessToken,
                url: url,
                selectedClass: user.data.SelectedClass,
                classRoom: classData.data,
                profileImg: imageUrl,
                badgeData: {
                    name: badgeData.data.BadgeName,
                    description: badgeData.data.BadgeDescription,
                },
                badgeImg: badgeImageUrl,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Badge({ classRoom, profileImg, badgeData, badgeImg }) {
    const router = useRouter();
    const { title, id } = router.query;

    return (
        <>
            <LayoutGames
                classRoom={classRoom}
                title={title}
                profileImg={profileImg}
            >
                <div className="relative flex flex-col mx-auto items-center w-full mt-28 -m-72 z-10">
                    <div className="flex flex-row items-center justify-center gap-x-10 min-w-[950px] px-10 bg-slate-200 rounded-xl shadow-2xl">
                        <div className="w-52 h-52 mx-auto bg-slate-200 mt-10 mb-10">
                            <Image
                                src={badgeImg}
                                alt="badge image"
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="flex flex-col items-center self-center gap-y-6">
                            <h1 className="text-grayText text-2xl">
                                CONGRATULAZIONI!
                            </h1>
                            <h1 className="text-grayText text-2xl">
                                AVETE VINTO UN NUOVO BADGE:
                            </h1>
                            <h1 className="text-orangeBtn text-3xl">
                                {badgeData.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex mt-10 gap-x-6">
                        <button className="py-3 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./attivita">GIOCHI</Link>
                        </button>
                        <button className="py-3 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./profilo">PROFILO</Link>
                        </button>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
