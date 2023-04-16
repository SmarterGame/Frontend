import LayoutProfile from "@/components/LayoutProfile";
import Image from "next/image";
import Link from "next/link";
import ghianda from "@/public/ghianda.svg";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";

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

        //Fetch boxes on Page Load
        const boxes = await axios({
            method: "get",
            url: url + "/box/all",
            headers: {
                Authorization: token,
            },
        });
        // console.log(boxes.data);

        //Fetch id of selected classroom
        const user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: token,
            },
        });
        // console.log(user.data.SelectedClass);

        //Fetch classroom data
        const classData = await axios({
            method: "get",
            url: url + "/classroom/getClassroomData/" + user.data.SelectedClass,
            headers: {
                Authorization: token,
            },
        });
        // console.log(classData.data);

        return {
            props: {
                token: session.accessToken,
                url: url,
                boxes: boxes.data,
                classRoom: classData.data,
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
    classRoom = { Ghiande: 0, Exp: 0 },
}) {
    const numGhiande = classRoom.Ghiande;
    const exp = classRoom.Exp; //TODO: risolvere problema percentuali

    return (
        <>
            <LayoutProfile
                token={token}
                url={url}
                boxes={boxes}
                classRoom={classRoom}
            >
                <div className="flex flex-col mx-auto h-[70%] w-1/2 bg-slate-200 rounded-xl shadow-2xl mt-10">
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

                    <div className="w-40 h-40 mx-auto bg-gray-700 rounded-full mt-10 shadow-xl">
                        <Image
                            src={"https://robohash.org/" + classRoom._id}
                            alt="Immagine profilo"
                            width={500}
                            height={500}
                            className="rounded-full"
                        />
                    </div>

                    <div className="mx-auto bg-slate-400 h-4 w-[60%] mt-14 rounded-full">
                        <div
                            className={`bg-yellow-400 h-4 rounded-full w-[${exp}%]`}
                        ></div>
                    </div>

                    <div className="mx-auto">
                        <h1 className=" text-orangeBtn text-4xl mt-14">
                            Scoiattoli livello {exp}
                        </h1>
                        <div className="flex flex-col h-full mt-14">
                            <button className=" mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[50%] h-[25%] rounded-md duration-300">
                                <Link href="./missioni">MISSIONI</Link>
                            </button>
                            <br></br>
                            <button className="mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[50%] h-[25%] rounded-md duration-300">
                                <Link href="./attivita">GIOCHI</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutProfile>
        </>
    );
}
