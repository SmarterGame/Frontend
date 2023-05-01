import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";

export default function Badge({ token, url, badge }) {
    const [badgeData, setBadgeData] = useState({});
    const [badgeImg, setBadgeImg] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const getBadge = async () => {
            const badgeData = await axios({
                method: "get",
                url: url + "/badge/getBadge/" + badge,
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            // console.log(badgeData.data);
            setBadgeData(badgeData.data);
        };
        const getBadgeImg = async () => {
            const badgeImg = await axios({
                method: "get",
                url: url + "/badge/getImg/" + badge,
                headers: {
                    Authorization: "Bearer " + token,
                },
                responseType: "arraybuffer",
            });
            const image = Buffer.from(badgeImg.data, "binary").toString(
                "base64"
            );
            const badgeImageUrl = `data:image/jpeg;base64,${image}`;
            setBadgeImg(badgeImageUrl);
        };
        getBadge();
        getBadgeImg();
    }, []);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setImageLoaded(true);
    //     }, 1000); // imposta un ritardo di 1 secondo
    //     return () => clearTimeout(timer);
    // }, []);

    const handleImageLoaded = () => {
        const timer = setTimeout(() => {
            setImageLoaded(true);
        }, 1000); // imposta un ritardo di 1 secondo
        return () => clearTimeout(timer);
    };

    return (
        <>
            <div className="flex felx-row items-center justify-center gap-x-6 w-full mt-6">
                {imageLoaded ? (
                    //Visualize image
                    <Image
                        src={badgeImg}
                        alt="badge image"
                        width={130}
                        height={130}
                    />
                ) : (
                    //Visualize skeleton
                    <ContentLoader
                        speed={2}
                        width={130}
                        height={100}
                        viewBox="0 0 130 100"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ffffff"
                    >
                        <circle cx={50} cy={50} r="50" />
                    </ContentLoader>
                )}
                <Image
                    src={badgeImg}
                    alt="badge image"
                    width={130}
                    height={130}
                    style={{ display: "none" }}
                    onLoad={() => setImageLoaded(true)}
                />
                <div className="flex flex-col bg-slate-100 w-[65%] h-[60%] rounded-xl">
                    <h1 className="mx-auto text-lg text-orangeBtn mt-2">
                        {badgeData.BadgeName}
                    </h1>
                    <h2 className="mx-auto text-md text-slate-500 mt-4 mb-4">
                        {badgeData.BadgeDescription}
                    </h2>
                </div>
            </div>
        </>
    );
}
