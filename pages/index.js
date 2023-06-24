import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";
import LayoutLogin from "../components/LayoutLogin";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import ita from "@/public/ita.png";
import eng from "@/public/eng.png";
import { useEffect, useState } from "react";

export const getServerSideProps = async ({ req, res }) => {
    // const url = "http://" + process.env.BACKEND_URI;
    const url = process.env.BACKEND_URI;
    const session = await getSession(req, res);

    if (session == null) {
        console.log("Early return");
        return { props: {} };
    }
    // console.log(session.accessToken)
    return { props: { token: session.accessToken, url: url } };
};

export default function Home({ token, url }) {
    const router = useRouter();

    const { user, isLoading } = useUser();

    const [flag, setFlag] = useState();
    const [language, setLanguage] = useState("ita");
    // sessionStorage.setItem("language", "ita");

    useEffect(() => {
        //Fetch the language
        // const fetchLanguage = async () => {
        //     try {
        //         const data = await fetch("/api/language/getLanguage");
        //         const language = await data.json();
        //         setLanguage(language);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };
        // fetchLanguage();
        sessionStorage.setItem("language", "ita");
        // setLanguage(sessionStorage.getItem("language"));
    }, []);

    useEffect(() => {
        //Set the flag image
        if (language === "eng") {
            setFlag(eng);
        } else {
            setFlag(ita);
        }
    }, [language]);

    //Switch the language
    const changeLanguageHandler = async () => {
        //Write the language
        let newLanguage;
        if (language === "eng") {
            newLanguage = "ita";
        } else {
            newLanguage = "eng";
        }
        sessionStorage.setItem("language", newLanguage);
        setLanguage(newLanguage);
        // try {
        //     await fetch("/api/language/writeLanguage", {
        //         method: "POST",
        //         body: newLanguage,
        //     }).then((res) => {
        //         router.reload();
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <>
            <LayoutLogin user={user} loading={isLoading}>
                <div className="flex flex-col items-center self-start mt-10">
                    <h2 className="text-slate-100 text-xl mb-2">
                        {language === "eng" ? "WELCOME TO" : "BENVENUTO SU"}
                    </h2>
                    <div className="flex flex-row transition ease-in-out hover:-translatey-1 hover:scale-110 duration-300">
                        <h1 className="text-7xl text-gray-100 text-stroke-orange">
                            SMART
                        </h1>
                        <h1 className="text-5xl text-gray-100 text-stroke-orange mt-[18px]">
                            GAME
                        </h1>
                    </div>

                    <div className="flex flex-col bg-lightGrayBadge max-w-6xl rounded-xl mt-6 mb-4 mx-4 shadow-2xl">
                        <div className="flex mx-auto text-justify">
                            <p className="text-lg ml-4 mr-4 mt-2">
                                Sed ut perspiciatis unde omnis iste natus error
                                sit voluptatem accusantium doloremque
                                laudantium, totam rem aperiam eaque ipsa, quae
                                ab illo inventore veritatis et quasi architecto
                                beatae vitae dicta sunt, explicabo. Nemo enim
                                ipsam voluptatem, quia voluptas sit, aspernatur
                                aut odit aut fugit, sed quia consequuntur magni
                                dolores eos, qui ratione voluptatem sequi
                                nesciunt, neque porro quisquam est, qui dolorem
                                ipsum, quia dolor sit, amet, consectetur,
                                adipisci velit, sed quia non numquam eius modi
                                tempora incidunt, ut labore et dolore magnam
                                aliquam quaerat voluptatem. Ut enim ad minima
                                veniam, quis nostrum exercitationem ullam
                                corporis suscipit laboriosam, nisi ut aliquid ex
                                ea commodi consequatur? Quis autem vel eum iure
                                reprehenderit, qui in ea voluptate velit esse,
                                quam nihil molestiae consequatur, vel illum, qui
                                dolorem eum fugiat, quo voluptas nulla pariatur?
                            </p>
                        </div>
                        {!user ? (
                            <div className="mx-auto text-center">
                                <h1 className="text-3xl mt-10 font-bold">
                                    {language === "eng"
                                        ? "Login to continue"
                                        : "Esegui il login"}
                                </h1>
                                <button className="transition ease-in-out delay-150 bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-xl font-bold shadow-2xl mt-5 mb-2 px-4 py-2 rounded-md duration-300">
                                    <Link href="/api/auth/login">
                                        {language === "eng"
                                            ? "Login"
                                            : "Accedi"}
                                    </Link>
                                </button>
                            </div>
                        ) : (
                            <div className="mx-auto text-center">
                                <h1 className="text-3xl mt-10 font-bold">
                                    {language === "eng"
                                        ? "Logout"
                                        : "Esegui il Logout"}
                                </h1>
                                <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-xl font-bold shadow-2xl mt-5 mb-2 px-4 py-2 rounded-md duration-300">
                                    <Link href="/api/auth/logout">
                                        {language === "eng" ? "Logout" : "Esci"}
                                    </Link>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed top-5 right-5">
                    <button
                        onClick={changeLanguageHandler}
                        className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-xl font-bold shadow-2xl px-4 py-2 rounded-md duration-300"
                    >
                        <div className="flex flex-row gap-x-4">
                            {language}
                            <Image src={flag} alt="badniera" width={40} />
                        </div>
                    </button>
                </div>
            </LayoutLogin>
        </>
    );
}
