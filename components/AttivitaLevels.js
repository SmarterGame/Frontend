import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";

export default function AttivitaLevels({
    children,
    classRoom = { Levels: [0, 0] },
    selectedMode,
    title,
    left,
}) {
    const router = useRouter();

    const [selectedLanguage, setSelectedLanguage] = useState();
    useEffect(() => {
        //Fetch the language
        // const fetchLanguage = async () => {
        //     try {
        //         const data = await fetch("/api/language/getLanguage");
        //         const language = await data.json();
        //         setSelectedLanguage(language);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };
        // fetchLanguage();
        setSelectedLanguage(sessionStorage.getItem("language"));
    }, []);

    const livQuantita = classRoom.Levels[0];
    const livOrdinamenti = classRoom.Levels[1];

    let offsetProcione = "";
    let offsetOrso = "";
    let livQuantita2 = false;
    let livQuantita3 = false;
    let livOrdinamenti2 = false;
    let livOrdinamenti3 = false;

    switch (livQuantita) {
        case 1:
            offsetProcione = "self-end";
            break;
        case 2:
            offsetProcione = "self-center";
            livQuantita2 = true;
            break;
        case 3:
            offsetProcione = "self-start";
            livQuantita2 = true;
            livQuantita3 = true;
            break;
    }
    switch (livOrdinamenti) {
        case 1:
            offsetOrso = "self-end";
            break;
        case 2:
            offsetOrso = "self-center";
            livOrdinamenti2 = true;
            break;
        case 3:
            offsetOrso = "self-start";
            livOrdinamenti2 = true;
            livOrdinamenti3 = true;
            break;
    }

    //If left, render quantità
    if (left)
        return (
            <>
                <div className="flex flex-row items-center sm:-mt-20">
                    <div
                        className={`flex flex-col ${offsetProcione} mt-7 -mr-10`}
                    >
                        {children}
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-grayText text-2xl">{title}</h1>
                        <button
                            className={`${
                                livQuantita3
                                    ? ""
                                    : "disabled:cursor-not-allowed"
                            }`}
                            disabled={livQuantita2 ? false : true}
                            onClick={() => {
                                if (selectedMode === "1")
                                    router.push(
                                        "./attivita/quantita/game1/3?game=quantita"
                                    );
                                if (selectedMode === "2")
                                    router.push(
                                        "./attivita/quantita/game2/3?game=quantita"
                                    );
                                if (selectedMode === "3")
                                    router.push(
                                        "./attivita/quantita/individual/3?game=quantita"
                                    );
                            }}
                        >
                            <div
                                className={`${
                                    livQuantita3
                                        ? "bg-yellowLevel hover:bg-orange-400"
                                        : "bg-neutral-500 hover:bg-neutral-600"
                                } text-neutral-500 text-lg flex justify-center items-center h-20 w-20 rounded-full -mt-[3px]`}
                            >
                                {livQuantita3 ? (
                                    "Liv. 3"
                                ) : (
                                    <LockOutlinedIcon
                                        fontSize="large"
                                        className="text-slate-200"
                                    />
                                )}
                            </div>
                        </button>
                        <div
                            className={`${
                                livQuantita3
                                    ? "border-yellowLevel bg-yellowLevel"
                                    : "border-neutral-500 bg-neutral-500"
                            } border-2 border-solid w-4 h-14 -mt-[3px]`}
                        ></div>
                        <button
                            className={`${
                                livQuantita2
                                    ? ""
                                    : "disabled:cursor-not-allowed"
                            }`}
                            disabled={livQuantita2 ? false : true}
                            onClick={() => {
                                if (selectedMode === "1")
                                    router.push(
                                        "./attivita/quantita/game1/2?game=quantita"
                                    );
                                if (selectedMode === "2")
                                    router.push(
                                        "./attivita/quantita/game2/2?game=quantita"
                                    );
                                if (selectedMode === "3")
                                    router.push(
                                        "./attivita/quantita/individual/2?game=quantita"
                                    );
                            }}
                        >
                            <div
                                className={`${
                                    livQuantita2
                                        ? "bg-yellowLevel hover:bg-orange-400"
                                        : "bg-neutral-500 hover:bg-neutral-600"
                                } text-neutral-500 text-lg flex justify-center items-center h-20 w-20 rounded-full -mt-[3px]`}
                            >
                                {livQuantita2 ? (
                                    "Liv. 2"
                                ) : (
                                    <LockOutlinedIcon
                                        fontSize="large"
                                        className="text-slate-200"
                                    />
                                )}
                            </div>
                        </button>
                        <div
                            className={`${
                                livQuantita2
                                    ? "border-yellowLevel bg-yellowLevel"
                                    : "border-neutral-500 bg-neutral-500"
                            } border-2 border-solid w-4 h-14 -mt-[2px]`}
                        ></div>
                        <button
                            onClick={() => {
                                if (selectedMode === "1")
                                    router.push(
                                        "./attivita/quantita/game1/1?game=quantita"
                                    );
                                if (selectedMode === "2")
                                    router.push(
                                        "./attivita/quantita/game2/1?game=quantita"
                                    );
                                if (selectedMode === "3")
                                    router.push(
                                        "./attivita/quantita/individual/1?game=quantita"
                                    );
                            }}
                        >
                            <div className="flex justify-center items-center text-neutral-500 text-lg bg-yellowLevel hover:bg-orange-400 h-20 w-20 rounded-full -mt-1 z-10">
                                Liv. 1
                            </div>
                        </button>
                    </div>
                </div>
            </>
        );
    //If right, render ordinamenti
    else
        return (
            <>
                <div
                    className={`flex flex-row items-center sm:-mt-20 ${
                        selectedLanguage === "eng" ? "-ml-10" : ""
                    }`}
                >
                    <div className={`flex flex-col ${offsetOrso} mt-7`}></div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-grayText text-2xl">{title}</h1>
                        <button
                            className={`${
                                livOrdinamenti3
                                    ? ""
                                    : "disabled:cursor-not-allowed"
                            }`}
                            disabled={livOrdinamenti3 ? false : true}
                            onClick={() => {
                                if (selectedMode === "1")
                                    router.push(
                                        "./attivita/ordinamenti/game1/3?game=ordinamenti"
                                    );
                                if (selectedMode === "2")
                                    router.push(
                                        "./attivita/ordinamenti/game2/3?game=ordinamenti"
                                    );
                                if (selectedMode === "3")
                                    router.push(
                                        "./attivita/ordinamenti/individual/3?game=ordinamenti"
                                    );
                            }}
                        >
                            <div
                                className={`${
                                    livOrdinamenti3
                                        ? "bg-yellowLevel hover:bg-orange-400"
                                        : "bg-neutral-500 hover:bg-neutral-600"
                                } text-neutral-500 text-lg flex justify-center items-center h-20 w-20 rounded-full -mt-[3px]`}
                            >
                                {livOrdinamenti3 ? (
                                    "Liv. 3"
                                ) : (
                                    <LockOutlinedIcon
                                        fontSize="large"
                                        className="text-slate-200"
                                    />
                                )}
                            </div>
                        </button>
                        <div
                            className={`${
                                livOrdinamenti3
                                    ? "border-yellowLevel bg-yellowLevel"
                                    : "border-neutral-500 bg-neutral-500"
                            } border-2 border-solid w-4 h-14 -mt-[3px]`}
                        ></div>
                        <button
                            className={`${
                                livOrdinamenti2
                                    ? ""
                                    : "disabled:cursor-not-allowed"
                            }`}
                            disabled={livOrdinamenti2 ? false : true}
                            onClick={() => {
                                if (selectedMode === "1")
                                    router.push(
                                        "./attivita/ordinamenti/game1/2?game=ordinamenti"
                                    );
                                if (selectedMode === "2")
                                    router.push(
                                        "./attivita/ordinamenti/game2/2?game=ordinamenti"
                                    );
                                if (selectedMode === "3")
                                    router.push(
                                        "./attivita/ordinamenti/individual/2?game=ordinamenti"
                                    );
                            }}
                        >
                            <div
                                className={`${
                                    livOrdinamenti2
                                        ? "bg-yellowLevel hover:bg-orange-400"
                                        : "bg-neutral-500 hover:bg-neutral-600"
                                } text-neutral-500 text-lg flex justify-center items-center h-20 w-20 rounded-full -mt-[3px]`}
                            >
                                {livOrdinamenti2 ? (
                                    "Liv. 2"
                                ) : (
                                    <LockOutlinedIcon
                                        fontSize="large"
                                        className="text-slate-200"
                                    />
                                )}
                            </div>
                        </button>
                        <div
                            className={`${
                                livOrdinamenti2
                                    ? "border-yellowLevel bg-yellowLevel"
                                    : "border-neutral-500 bg-neutral-500"
                            } border-2 border-solid w-4 h-14 -mt-[2px]`}
                        ></div>
                        <button
                            onClick={() => {
                                if (selectedMode === "1")
                                    router.push(
                                        "./attivita/ordinamenti/game1/1?game=ordinamenti"
                                    );
                                if (selectedMode === "2")
                                    router.push(
                                        "./attivita/ordinamenti/game2/1?game=ordinamenti"
                                    );
                                if (selectedMode === "3")
                                    router.push(
                                        "./attivita/ordinamenti/individual/1?game=ordinamenti"
                                    );
                            }}
                        >
                            <div className="flex justify-center items-center text-neutral-500 text-lg bg-yellowLevel hover:bg-orange-400 h-20 w-20 rounded-full -mt-1 z-10">
                                Liv. 1
                            </div>
                        </button>
                    </div>
                    <div
                        className={`flex flex-col ${offsetOrso} mt-7 ${
                            selectedLanguage === "eng" ? "-ml-32" : "-ml-10"
                        }`}
                    >
                        {children}
                    </div>
                </div>
            </>
        );
}
