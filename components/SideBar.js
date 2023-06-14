import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
    getSelectedLanguage,
    setSelectedLanguage,
} from "@/components/lib/language";

export default function SiedBar({ token, url, show, onClose, children }) {
    const router = useRouter();

    const sideBarRef = useRef(null);
    // const [showCustom, setShowCustom] = useState(false);

    const selectedLanguage = getSelectedLanguage();

    //Check if the click was outside of the modal
    useEffect(() => {
        function handleClickOutside(event) {
            //If the click was outside of the modal, close it
            if (
                sideBarRef.current &&
                !sideBarRef.current.contains(event.target)
            ) {
                onClose();
            }
        }

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show]);

    const changeImageHandler = async () => {
        const { value: file } = await Swal.fire({
            title: "Seleziona immagine",
            input: "file",
            confirmButtonColor: "#ff7100",
            inputAttributes: {
                accept: "image/*",
                "aria-label": "Upload your profile picture",
            },
        });

        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                await axios({
                    method: "post",
                    url: url + "/user/changeProfileImg",
                    data: formData,
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "multipart/form-data",
                    },
                });
                Swal.fire({
                    title: "Immagine cambiata!",
                    text: "L'immagine è stata cambiata correttamente",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => {
                    if (router.pathname === "/mockup/profilo") router.reload();
                });
            } catch (err) {
                Swal.fire({
                    title: "Errore",
                    text: "Si è verificato un errore nel cambiare l'immagine",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
                console.log(err);
            }
        }
    };

    //Switch the language
    const changeLanguageHandler = () => {
        if (getSelectedLanguage() === "eng") {
            setSelectedLanguage("ita");
        } else {
            setSelectedLanguage("eng");
        }

        router.replace(router.asPath);
    };

    return (
        <>
            <div
                className={`${
                    show ? "translate-x-0" : "translate-x-full"
                } transition duration-300 fixed top-0 right-0 h-full bg-gray-200 shadow-2xl z-40`}
            >
                <div
                    className="flex flex-col mt-4 px-3 gap-y-2 h-full"
                    ref={sideBarRef}
                >
                    <div className="flex border-b-2 border-gray-300 mb-1 text-3xl">
                        <h1 className="mx-auto text-orangeBtn mb-2">
                            Smart Game
                        </h1>
                    </div>
                    {children}
                    <div className="flex w-full py-2 px-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md">
                        <button
                            onClick={changeImageHandler}
                            className="mx-auto text-gray-600 text-lg"
                        >
                            {selectedLanguage === "eng"
                                ? "CHANGE IMAGE"
                                : "CAMBIA IMMAGINE"}
                        </button>
                    </div>
                    <div className="flex w-full py-2 px-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md">
                        <button
                            onClick={changeLanguageHandler}
                            className="mx-auto text-gray-600 text-lg"
                        >
                            {selectedLanguage === "eng"
                                ? "ENGLISH"
                                : "ITALIANO"}
                        </button>
                    </div>
                    {/* <div className="hidden flex w-full py-2 px-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md">
                        <button
                            onClick={() => {
                                setShowCustom(!showCustom);
                            }}
                            className="mx-auto text-gray-600 text-lg"
                        >
                            PERSONALIZZA GIOCHI
                        </button>
                    </div>
                    <div
                        className={`${
                            showCustom ? "" : "hidden"
                        } flex w-full py-2 px-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md`}
                    >
                        <button className="mx-auto text-gray-600 text-lg">
                            <Link
                                href={`/customGames?prevPath=${router.pathname}&game=quantita`}
                            >
                                QUANTITA
                            </Link>
                        </button>
                    </div>
                    <div
                        className={`${
                            showCustom ? "" : "hidden"
                        } flex w-full py-2 px-2 hover:bg-gray-400 hover:bg-opacity-70 rounded-md`}
                    >
                        <button className="mx-auto text-gray-600 text-lg">
                            <Link
                                href={`/customGames?prevPath=${router.pathname}&game=ordinamenti`}
                            >
                                ORDINAMENTI
                            </Link>
                        </button>
                    </div> */}
                    <div className="border-t-2 border-gray-300 mt-1"></div>
                    <div className="py-2 hover:bg-red-400 hover:bg-opacity-80 rounded-md mt-auto mb-10">
                        <button className="h-full w-full transition ease-in-out text-gray-600 text-xl">
                            <Link href="/api/auth/logout">
                                {selectedLanguage === "eng" ? "LOGOUT" : "ESCI"}
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
