import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";

export const getServerSideProps = async ({ req, res }) => {
    const url = process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

        // Fetch classrooms on Page Load
        const token = "Bearer " + session.accessToken;

        return {
            props: {
                token: session.accessToken,
                url: url,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Tmp({ token, url }) {

    const callAPI = async () => {
        try {
            const response = await axios({
                method: "get",
                url: url + "/games/changeGames",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            console.log(response);
        } catch (err) {
            console.log(err);
            console.log(url);
            return { props: {} };
        }
    };

    return (
        <>
            <div className="flex justify-center items-center">
                <button className="bg-red-500" onClick={() => callAPI()}>
                    API test
                </button>
            </div>
        </>
    );
}
