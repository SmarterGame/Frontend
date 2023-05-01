import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import Swal from "sweetalert2";
import Image from "next/image";

const idPrimoLivello = "644e68e5a7739832235569e8";
const idOrdinamenti = "644e6944d21ec4a78bd417ea";
const idQuantita = "644e6963c3bdccd2e1b7df76";
const idScoiattoliPrudenti = "644e698752640d86fa9da5be";
const idRanger = "644e69a00ed8a6e7c4e4b07b";
const idPerfezionisti = "644e69c3a0269b4b94a4f0b9";
const idPerfezionisti2 = "644e69ea44aa8453d1edc377";
const idPerfezionisti3 = "644e69f2dc0afb58fbf07f5f";

export const getServerSideProps = async ({ req, res }) => {
    const url = process.env.BACKEND_URI;
    try {
        const session = await getSession(req, res);

        // EXIT if the session is null (Not Logged)
        if (session == null) {
            console.log("Early return");
            return { props: {} };
        }

        const token = "Bearer " + session.accessToken;

        const badgeImg = await axios({
            method: "get",
            url: url + "/badge/getImg/" + idPerfezionisti2,
            headers: {
                Authorization: token,
            },
            responseType: "arraybuffer",
        });
        // console.log(badgeImg.data);
        const image = Buffer.from(badgeImg.data, "binary").toString("base64");
        const imageUrl = `data:image/jpeg;base64,${image}`;

        return {
            props: {
                token: session.accessToken,
                url: url,
                badgeImg: imageUrl,
            },
        };
    } catch (err) {
        console.log(err);
        console.log(url);
        return { props: {} };
    }
};

export default function Tmp({ token, url, badgeImg }) {
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

    const callAPIBadge = async () => {
        try {
            const response = await axios({
                method: "post",
                url: url + "/badge/add",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const addBadgeImg = async () => {
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
                    url: url + "/badge/modifyImg/" + idPerfezionisti2,
                    data: formData,
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "multipart/form-data",
                    },
                });
                Swal.fire({
                    title: "Immagine caricata!",
                    text: "L'immagine è stata caricata correttamente",
                    icon: "success",
                    confirmButtonText: "Ok",
                });
            } catch (err) {
                Swal.fire({
                    title: "Errore",
                    text: "Si è verificato un errore nel caricare l'immagine",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
                console.log(err);
            }
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center mt-10 gap-y-6">
                <button className="bg-red-500" onClick={() => callAPI()}>
                    change games data
                </button>
                <button className="bg-green-500" onClick={() => callAPIBadge()}>
                    Add badges
                </button>
                <button className="bg-blue-500" onClick={() => addBadgeImg()}>
                    add Badge img
                </button>
                <Image src={badgeImg} alt="Badge image" width={100} height={100} />
            </div>
        </>
    );
}
