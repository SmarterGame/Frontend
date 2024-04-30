import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";
import procioneBadgeToComplete from "@/public/procioneBadgeToComplete.svg"
import procioneBadgeCompleted from "@/public/procioneBadgeCompleted.svg"

export default function Badge({ token, url, badge, blocked }) {
    // const [badgeData, setBadgeData] = useState({});
    const [imageLoaded, setImageLoaded] = useState(false);

    // const selectedLanguage = getSelectedLanguage();
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

    // useEffect(() => {
    //     // const getBadge = async () => {
    //     //     const badgeData = await axios({
    //     //         method: "get",
    //     //         url: url + "/badge/getBadge/" + badge,
    //     //         headers: {
    //     //             Authorization: "Bearer " + token,
    //     //         },
    //     //     });
    //     //     // console.log(badgeData.data);
    //     //     // checkLanguage(badgeData.data);
    //     //     setBadgeData(badgeData.data);
    //     // };
    //     const getBadgeImg = async () => {
    //         const badgeImg = await axios({
    //             method: "get",
    //             url:
    //                 url +
    //                 "/badge/getImg/" +
    //                 badge._id +
    //                 "?blocked=" +
    //                 blocked +
    //                 "&eng=" +
    //                 (selectedLanguage === "eng"),
    //             headers: {
    //                 Authorization: "Bearer " + token,
    //             },
    //             responseType: "arraybuffer",
    //         });
    //         const image = Buffer.from(badgeImg.data, "binary").toString(
    //             "base64"
    //         );
    //         const badgeImageUrl = `data:image/jpeg;base64,${image}`;
    //         setBadgeImg(badgeImageUrl);
    //     };
    //     // getBadge();
    //     getBadgeImg();
    // }, []);

    // const checkLanguage = (badgeData) => {
    //     const language = selectedLanguage;
    //     if (language === "ita") {
    //         setBadgeData(badgeData);
    //     } else {
    //         const badgeDataTranslated = {
    //             BadgeName: badgeData?.BadgeName_en,
    //             BadgeDescription: badgeData?.BadgeDescription_en,
    //         };
    //         setBadgeData(badgeDataTranslated);
    //     }
    // };

    // const handleImageLoaded = () => {
    //     const timer = setTimeout(() => {
    //         setImageLoaded(true);
    //     }, 1000); // imposta un ritardo di 1 secondo
    //     return () => clearTimeout(timer);
    // };

    return (
        <>
            <div className="flex flex-row items-center justify-center gap-x-6 w-full mt-6">
                <Image
                    src={blocked ? procioneBadgeToComplete : procioneBadgeCompleted}
                    alt="badge image"
                    width={130}
                    height={130}
                />
                <div className="flex flex-col bg-slate-100 w-[65%] rounded-xl">
                    <h1 className="mx-auto text-lg text-orangeBtn mt-2">
                        {selectedLanguage === "eng"
                            ? badge?.BadgeName_en
                            : badge?.BadgeName}
                    </h1>
                    <h2 className="mx-auto text-md text-slate-500 mt-4 mb-4">
                        {selectedLanguage === "eng"
                            ? badge?.BadgeDescription_en
                            : badge?.BadgeDescription}
                    </h2>
                </div>
            </div>
        </>
    );
}
