import { useState, useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";
import Layout from "../components/LayoutLogin";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/router";

export const getServerSideProps = async ({ req, res }) => {
    const url = "http://" + process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);
        if (session == null) {
            return { props: {} };
        }
        return { props: { token: session.accessToken, url: url } };
    } catch (err) {
        console.log(err);
        return { props: {} };
    }
};

export default function AddBox({ token, url }) {
    const router = useRouter();
    const { id } = router.query;
    const { user, isLoading } = useUser();

    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const asyncFn = async () => {
            const result = await axios({
                method: "get",
                url: url + "/box/add/" + id,
                headers: { authorization: "Bearer " + token },
            });
            console.log(result.data);
            setError(result.data.error);
            setMessage(result.data.message);
            setTimeout(() => {
                setFinished(true);
            }, 1000);
        };
        asyncFn();
    }, []);

    useEffect(() => {
        if (finished) {
            error
                ? Swal.fire("Error", `${message}`, "error")
                : Swal.fire("You did it!", "You connected the box!", "success");
        }
    }, [finished]);

    return (
        <Layout user={user} loading={isLoading}>
            <div className="flex items-center justify-center h-screen w-screen font-bold text-xl">
                {!finished ? "Loading..." : ""}
            </div>
        </Layout>
    );
}
