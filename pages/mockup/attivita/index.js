import LayoutSelezioneGiochi from "@/components/LayoutSelezioneGiochi";
import Image from "next/image";
import montagna from "@/public/montagnaSMARTER.png";
import orsoFaccia from "@/public/orsoFaccia.svg";
import procioneFaccia from "@/public/procioneFaccia.svg";
import grass from "@/public/grass.png";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import Levels from "@/components/AttivitaLevels";

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
        //console.log(user.data);

        //Fetch classroom data
        const classData = await axios({
            method: "get",
            url: url + "/classroom/" + user.data.SelectedClass,
            headers: {
                Authorization: token,
            },
        });
        // console.log(classData.data);

        return {
            props: {
                token: session.accessToken,
                url: url,
                classRoom: classData.data,
                selectedMode: user.data.SelectedMode,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Giochi({ classRoom, selectedMode }) {
    return (
        <>
            <LayoutSelezioneGiochi classRoom={classRoom} title={"GIOCHI"}>
                <div className="flex flex-col items-center mx-auto h-[80%] w-[80%] bg-slate-200 rounded-xl shadow-2xl mt-6">
                    <h1 className="mt-10 text-4xl text-orangeBtn">
                        SCEGLI UN GIOCO
                    </h1>
                    <div className="flex flex-row justify-center items-center h-full">
                        <Levels
                            classRoom={classRoom}
                            selectedMode={selectedMode}
                            title={"LE QUANTITA'"}
                            left={true}
                        >
                            <Image src={procioneFaccia} width={100} />
                        </Levels>

                        <Image
                            src={montagna}
                            width={800}
                            className="self-end"
                        />

                        <Levels
                            classRoom={classRoom}
                            selectedMode={selectedMode}
                            title={"ORDINAMENTI"}
                            left={false}
                        >
                            <Image src={orsoFaccia} width={100} />
                        </Levels>
                    </div>
                </div>

                <Image src={grass} className="w-full object-fill -mt-[51px]" />
            </LayoutSelezioneGiochi>
        </>
    );
}