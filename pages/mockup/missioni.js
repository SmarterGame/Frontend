import { useEffect, useState } from "react";
import Link from "next/link";
import LayoutProfile from "@/components/LayoutProfile";
import Badge from "@/components/Badge";
import PopUp from "@/components/settingsPopUp";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import Swal from "sweetalert2";

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
        console.log("ECCOLO: "+boxes.data);

        //Fetch id of selected classroom
        const user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: token,
            },
        });
        // console.log(user.data.SelectedClass);

        //Fetch badges data
        const badges = await axios({
            method: "get",
            url: url + "/badge/getBadges/",
            headers: {
                Authorization: token
            }
        })

        //Fetch classroom data
        let individualData;
        //Load individual data if user is individual
        if (user.data.IsIndividual) {
            individualData = await axios({
                method: "get",
                url:
                    url + "/individual/getData/" + user.data.SelectedIndividual,
                headers: {
                    Authorization: token,
                },
            });
            // console.log(classData.data);
        }

        const classData = await axios({
            method: "get",
            url:
                url +
                "/classroom/getClassroomData/" +
                user.data.SelectedClass,
            headers: {
                Authorization: token,
            },
        });

        return {
            props: {
                token: session.accessToken,
                url: url,
                user: user.data,
                boxes: boxes.data,
                classRoom: classData?.data ?? null,
                individual: individualData?.data ?? null,
                isIndividual: user.data.IsIndividual,
                badges: badges.data
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {
            error: err.message
        } };
    }
};

export default function BadgePage({ token, url, user, boxes, classRoom, individual, isIndividual, badges, error}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [loading, setLoading] = useState(true);
    const [badgeList, setBadgeList] = useState(badges ?? []);
    const [badgeListFiltered, setBadgeListFiltered] = useState([]);

    // const selectedLanguage = getSelectedLanguage();
    const [selectedLanguage, setSelectedLanguage] = useState();

    const badgeNotFoundLabel = selectedLanguage === "eng" ?
        "No badge available"
        : "Nessun badge disponibile"

    if (error) {
        Swal.fire({
            icon: "error",
            title: error,
        })
    }
    if (!classRoom && !individual) {
        return null
    }

    const selectedSmarters = []
    user.data.SelectedSmarters.forEach(value => {
        const filtered = boxes.data.filter((box) => box._id == value)
        if (filtered.length > 0) {
            selectedSmarters.push(filtered[0].name);
        }
    })
    const selectedOptions = {
        selectedSmarters: selectedSmarters,
        selectedMode: user.data.SelectedMode,
    };

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

    //Filter badges
    useEffect(() => {
        setBadgeListFiltered(badgeList);
        //Filter non obtained badges
        const checkBadges = isIndividual ? individual.Badges : classRoom.Badges;
        const filteredList1 = badgeList.filter(
            (badge) => !checkBadges.includes(badge)
        );
        setBadgeListFiltered(filteredList1);

        //Filter obtained badges
        const filteredList2 = badgeList.filter((badge) =>
            checkBadges.includes(badge)
        );
        setBadgeList(filteredList2);
        setLoading(false);
    }, []);

    //Toggle settings popup
    function togglePopUp() {
        setShowPopUp(!showPopUp);
    }

    return (
        <>
            <LayoutProfile
                token={token}
                url={url}
                boxes={boxes}
                classRoom={classRoom}
                individual={individual}
                isIndividual={isIndividual}
                userBoxes={user.Boxes}
                selectedOptions={selectedOptions}
            >
                <div className="relative flex flex-col mx-auto h-[70vh] w-[60%] bg-slate-200 rounded-xl shadow-2xl mt-10 z-20">
                    <h1 className="mx-auto text-4xl text-orangeBtn mt-6">
                        BADGE
                    </h1>

                    <div className="overflow-auto h-full flex flex-col items-center justify-center">
                        {loading
                            ? ""
                            : badgeList?.map((badge) => (
                                  <Badge
                                      token={token}
                                      url={url}
                                      badge={badge}
                                      blocked={false}
                                  />
                              ))}
                        {loading
                            ? ""
                            : badgeListFiltered?.length === 0 ?
                            (<div>{badgeNotFoundLabel}</div>)
                            : badgeListFiltered?.map((badge) => (
                                  <Badge
                                      token={token}
                                      url={url}
                                      badge={badge}
                                      blocked={true}
                                  />
                              ))}
                    </div>

                    <div className="flex justify-center gap-x-4 mb-4 mt-4 h-[20%] w-full">
                        <button className="self-end h-12 w-40 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./attivita">
                                {selectedLanguage === "eng"
                                    ? "GAMES"
                                    : "GIOCHI"}
                            </Link>
                        </button>
                        <button className="self-end h-12 w-40 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./profilo">
                                {selectedLanguage === "eng"
                                    ? "PROFILE"
                                    : "PROFILO"}
                            </Link>
                        </button>
                    </div>
                </div>

                <PopUp show={showPopUp} onClose={togglePopUp} classId={classRoom._id} url={url} token={token} boxes={boxes} userBoxes={user.Boxes} selectedOptions={selectedOptions}></PopUp>
            </LayoutProfile>
        </>
    );
}
