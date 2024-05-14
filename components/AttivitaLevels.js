import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";

export default function AttivitaLevels({ children, gameId, levels = [], selectedMode, title, left }) {
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

    return (
        <>
            <div className="flex flex-row items-center sm:-mt-20 z-50">
                <div className="flex flex-col items-center">
                    {title.length <= 11 ? (
                        <h1 className={`text-grayText text-3xl ${ left ? "self-end" :  "self-start"}`}>{title}</h1>
                    ) : (
                        <h1 className={`text-grayText text-3xl ${ left ? "self-end" :  "self-start"}`}>{title.substring(0, 11) + ".."}</h1>
                    )}
                    <div className="flex flex-col items-center mt-8">
                        {levels?.toReversed?.().map((lv, index) => (
                            <div key={index}>
                                <div className={`flex ${ left ? "" :  "flex-row-reverse"} items-center`}>
                                    {lv.enabled ? (<div className={`w-[80px] ${ left ? "mr-10" :  "ml-10"}`}>{children}</div>) : (<div className={`w-[80px] ${ left ? "mr-10" :  "ml-10"}`}></div>)}
                                    <button
                                        key={index}
                                        className={`${lv.enabled ? "" : "disabled:cursor-not-allowed"}`}
                                        disabled={lv.enabled ? false : true}
                                        onClick={() => {
                                            router.push("./attivita/"+ gameId +"?level="+ lv.n);
                                        }}
                                    >
                                        <div
                                            className={`${
                                                lv.enabled
                                                    ? "bg-yellowLevel hover:bg-orange-400"
                                                    : "bg-neutral-500 hover:bg-neutral-600"
                                            } text-neutral-500 text-xl flex justify-center items-center h-[100px] w-[100px] rounded-full -mt-[3px]`}
                                        >
                                            {lv.enabled ? (
                                                "Liv. " + lv.n
                                            ) : (
                                                <LockOutlinedIcon fontSize="large" className="text-slate-200" />
                                            )}
                                        </div>
                                    </button>
                                </div>
                                {(index < levels.length-1) && (
                                    <div className={`flex ${ left ? "" :  "flex-row-reverse"}`}>
                                        <div className={`w-[80px] ${ left ? "mr-20" :  "ml-20"}`}></div>
                                        <div
                                            className={`${
                                                lv.enabled ? "border-yellowLevel bg-yellowLevel" : "border-neutral-500 bg-neutral-500"
                                            } border-2 border-solid w-4 h-14 -mt-[3px]`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}