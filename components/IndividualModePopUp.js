import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
export default function IndividualModePopUP({
    token,
    url,
    classId,
    show,
    onClose,
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

    const [profileName, setProfileName] = useState("");
    const [individuals, setIndividuals] = useState([]);
    const [tmp, setTmp] = useState(false);
    const [selectedIndividual, setSelectedIndividual] = useState(null);

    useEffect(() => {
        const getClassIndividuals = async () => {
            if (!classId) return;
            try {
                const result = await axios({
                    method: "get",
                    url:
                        url +
                        "/individual/getClassIndividuals?classId=" +
                        classId,
                    headers: { Authorization: "Bearer " + token },
                });
                // console.log(result.data);
                //Save individuals to show them in the select
                setIndividuals(result.data);
            } catch (err) {
                console.log(err);
            }
        };
        getClassIndividuals();
    }, [classId, tmp]);

    //Save new individual profile
    const addProfile = async () => {
        // console.log(profileName);
        const data = {
            name: profileName,
            classId: classId,
        };
        try {
            //Add new individual profile
            const result = await axios({
                method: "post",
                url: url + "/individual/add",
                data: data,
                headers: { Authorization: "Bearer " + token },
            });
            // console.log(result.data);
            // router.reload();
            setTmp(!tmp);
            setProfileName("");
            const title = selectedLanguage === "eng" ? "Success!" : "Successo!";
            const text =
                selectedLanguage === "eng"
                    ? "Profile added"
                    : "Profilo aggiunto";
            Swal.fire({
                icon: "success",
                title: title,
                text: text,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleConfirm = () => {
        if (selectedIndividual === null) {
            const title = selectedLanguage === "eng" ? "Error!" : "Errore!";
            const text =
                selectedLanguage === "eng"
                    ? "No profile selected"
                    : "Nessun profilo selezionato";
            Swal.fire({
                icon: "error",
                title: title,
                text: text,
            });
        } else {
            try {
                const data = {
                    classId: classId,
                    individualId: selectedIndividual,
                };
                axios({
                    method: "post",
                    url: url + "/user/setIndividual",
                    data: data,
                    headers: { Authorization: "Bearer " + token },
                }).then((res) => {
                    router.push("/mockup/profilo");
                });
                onClose();
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <>
            <div
                className={`${
                    show ? "scale-100" : "scale-0"
                } transition-transform duration-300 ease-in-out fixed inset-0 z-50`}
            >
                <section className="modal-main rounded-2xl">
                    <div className="flex flex-col items-center">
                        <h1 className="text-grayText text-4xl mt-6 mb-10">
                            {selectedLanguage === "eng"
                                ? "SELECT A PROFILE"
                                : "SELEZIONA UN PROFILO"}
                        </h1>

                        <div className="flex flex-row items-center gap-x-10 mb-4">
                            <h1 className="text-3xl text-grayText">
                                {selectedLanguage === "eng"
                                    ? "PROFILE NAME"
                                    : "NOME PROFILO"}
                            </h1>
                            <select
                                className="w-96 h-12 bg-grayLight text-center"
                                defaultValue={
                                    selectedLanguage === "eng"
                                        ? "No profile selected"
                                        : "Nessun profilo selezionato"
                                }
                                onChange={(e) => {
                                    setSelectedIndividual(e.target.value);
                                }}
                            >
                                <option>
                                    {selectedLanguage === "eng"
                                        ? "No propfile selected"
                                        : "Nessun profilo selezionato"}
                                </option>
                                {individuals.map((individual) => (
                                    <option
                                        key={individual._id}
                                        value={individual._id}
                                    >
                                        {individual.ClassName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-row items-center gap-x-16 mb-4">
                            <h1 className="text-3xl text-grayText">
                                {selectedLanguage === "eng"
                                    ? "ADD PROFILE"
                                    : "AGGIUNGI PROFILO"}
                            </h1>
                            <div className="flex flex-row items-center">
                                <input
                                    onChange={(e) =>
                                        setProfileName(e.target.value)
                                    }
                                    value={profileName}
                                    className="w-80 h-12 bg-grayLight text-center -ml-2 mr-4"
                                    placeholder={`${
                                        selectedLanguage === "eng"
                                            ? "Enter name..."
                                            : "Inserisci nome..."
                                    }`}
                                ></input>
                                <button
                                    onClick={addProfile}
                                    className="transition ease-in-out hover:-translatey-1 hover:scale-110 duration-300"
                                >
                                    <PersonAddAlt1Icon fontSize="large" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-row gap-x-6 mb-6">
                            <div className="grid grid-cols-2 gap-x-4">
                                <button
                                    onClick={handleConfirm}
                                    className="h-12 w-56 mt-6 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300"
                                >
                                    {selectedLanguage === "eng"
                                        ? "Confirm"
                                        : "Conferma"}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="h-12 w-56 mt-6 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300"
                                >
                                    {selectedLanguage === "eng"
                                        ? "Cancel"
                                        : "Annulla"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
