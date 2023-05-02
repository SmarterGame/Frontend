import { useEffect, useState } from "react";
import Link from "next/link";
import LayoutProfile from "@/components/LayoutProfile";
import Badge from "@/components/Badge";
import PopUp from "@/components/settingsPopUp";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";

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
        // console.log(boxes.data);

        //Fetch id of selected classroom
        const user = await axios({
            method: "get",
            url: url + "/user/me",
            headers: {
                Authorization: token,
            },
        });
        // console.log(user.data.SelectedClass);

        //Fetch classroom data
        const classData = await axios({
            method: "get",
            url: url + "/classroom/getClassroomData/" + user.data.SelectedClass,
            headers: {
                Authorization: token,
            },
        });
        // console.log(classData.data);

        return {
            props: {
                token: session.accessToken,
                url: url,
                boxes: boxes.data,
                classRoom: classData.data,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function BadgePage({ token, url, boxes, classRoom }) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [loading, setLoading] = useState(true);
    const [badgeList, setBadgeList] = useState([
        "644e68e5a7739832235569e8",
        "644e6944d21ec4a78bd417ea",
        "644e6963c3bdccd2e1b7df76",
        "644e698752640d86fa9da5be",
        "644e69a00ed8a6e7c4e4b07b",
        "644e69c3a0269b4b94a4f0b9",
        "644e69ea44aa8453d1edc377",
        "644e69f2dc0afb58fbf07f5f",
    ]);
    const [badgeListFiltered, setBadgeListFiltered] = useState([]);

    //Filter badges
    useEffect(() => {
        setBadgeListFiltered(badgeList);
        //Filter non obtained badges
        const filteredList1 = badgeList.filter(
            (badge) => !classRoom.Badges.includes(badge)
        );
        setBadgeListFiltered(filteredList1);

        //Filter obtained badges
        const filteredList2 = badgeList.filter((badge) =>
            classRoom.Badges.includes(badge)
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
            >
                <div className="relative flex flex-col mx-auto h-[70vh] w-[60%] bg-slate-200 rounded-xl shadow-2xl mt-10 z-20">
                    <h1 className="mx-auto text-4xl text-orangeBtn mt-6">
                        BADGE
                    </h1>

                    <div className="overflow-auto h-full">
                        {loading
                            ? ""
                            : badgeList.map((badge) => (
                                  <Badge
                                      token={token}
                                      url={url}
                                      badge={badge}
                                      blocked={false}
                                  />
                              ))}
                        {loading
                            ? ""
                            : badgeListFiltered.map((badge) => (
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
                            <Link href="./attivita">GIOCHI</Link>
                        </button>
                        <button className="self-end h-12 w-40 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./profilo">PROFILO</Link>
                        </button>
                    </div>
                </div>

                <PopUp show={showPopUp} onClose={togglePopUp}></PopUp>
            </LayoutProfile>
        </>
    );
}
