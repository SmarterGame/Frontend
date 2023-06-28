import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function Home({ token, url, show, onClose, boxes, userBoxes }) {
    const [selectedLanguage, setSelectedLanguage] = useState();

    useEffect(() => {
        setSelectedLanguage(sessionStorage.getItem("language"));
    }, []);

    //Filtra i box che l'utente ha già
    if (boxes === undefined) boxes = [];
    const filteredBoxes = boxes.filter((box) => !userBoxes.includes(box));

    const [isChecked, setIsChecked] = useState(
        Array(filteredBoxes.length).fill(false)
    );

    const fireSwal = () => {
        const title =
            selectedLanguage === "eng" ? "Box added!" : "Box aggiunti!";
        const text =
            selectedLanguage === "eng"
                ? "The SMARTERs have been added correctly"
                : "Gli SMARTER sono stati aggiunti correttamente";

        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    };

    const handleConferma = async () => {
        //controlla che almeno uno sia selezionato
        if (!isChecked.includes(true)) {
            const title =
                selectedLanguage === "eng" ? "Warning!" : "Attenzione!";
            const text =
                selectedLanguage === "eng"
                    ? "You must select at least one box"
                    : "Devi selezionare almeno un box";
            Swal.fire({
                title: title,
                text: text,
                icon: "warning",
                confirmButtonText: "Ok",
            });
        } else {
            try {
                let res;
                for (let i = 0; i < filteredBoxes.length; i++) {
                    if (isChecked[i]) {
                        res = await axios({
                            method: "get",
                            url: url + "/box/add/" + filteredBoxes[i],
                            headers: { authorization: "Bearer " + token },
                        });
                    }
                }
                fireSwal();
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleCheckboxChange = (event, index) => {
        const newChecked = [...isChecked];
        newChecked[index] = event.target.checked;
        setIsChecked(newChecked);
    };

    return (
        <>
            <div
                className={`${
                    show ? "scale-100" : "scale-0"
                } transition-transform duration-300 ease-in-out fixed inset-0 z-50`}
            >
                <section className="modal-main rounded-2xl">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-grayText text-4xl mt-4">
                            {selectedLanguage === "eng"
                                ? "SELECT SMARTERS"
                                : "SELEZIONA GLI SMARTER"}
                        </h1>
                        <div className="mt-4">
                            <label className="text-gray-700 text-xl cursor-pointer">
                                {filteredBoxes && filteredBoxes.length > 0 ? (
                                    filteredBoxes.map((box, index) => (
                                        <div key={box}>
                                            <input
                                                type="checkbox"
                                                className="mr-2 mt-3 scale-150"
                                                checked={isChecked[index]}
                                                onChange={(event) =>
                                                    handleCheckboxChange(
                                                        event,
                                                        index
                                                    )
                                                }
                                            />
                                            <span>{box}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>
                                        {selectedLanguage === "eng"
                                            ? "There are no boxes to add"
                                            : "Non ci sono box da aggiungere"}
                                    </p>
                                )}
                            </label>
                        </div>
                        <div className="flex flex-row gap-x-6">
                            <div className="grid grid-cols-2 gap-x-4">
                                <button
                                    onClick={handleConferma}
                                    className="h-12 w-56 mt-6 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300"
                                >
                                    {selectedLanguage === "eng"
                                        ? "CONFIRM"
                                        : "CONFERMA"}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="h-12 w-56 mt-6 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300"
                                >
                                    {selectedLanguage === "eng"
                                        ? "CANCEL"
                                        : "ANNULLA"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
