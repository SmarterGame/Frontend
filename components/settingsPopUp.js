import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import axios from "axios";

export default function PopUp({
    token,
    url,
    show,
    onClose,
    children,
    boxes,
    classId,
    selectedOptions,
}) {
    // console.log(selectedOptions);
    const selectedSmarters = selectedOptions.selectedSmarters;
    const selectedMode = selectedOptions.selectedMode;

    const router = useRouter();

    const popUpRef = useRef(null);

    const [smarter1, setSmarter1] = useState(selectedSmarters[0]);
    const [smarter2, setSmarter2] = useState(selectedSmarters[1]);
    const [modalita, setModalita] = useState(selectedMode);

    const [swalPopup, setSwalPopup] = useState(false);

    //Check if the click was outside of the modal
    useEffect(() => {
        function handleClickOutside(event) {
            //If the click was outside of the modal, close it
            if (
                popUpRef.current &&
                !popUpRef.current.contains(event.target) &&
                !swalPopup
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
    }, [show, swalPopup]);

    function handleChangeSmarter1(event) {
        const selectedOption = event.target.value;
        if (selectedOption === "Nessuno smarter selezionato") setSmarter1(null);
        else setSmarter1(selectedOption);
    }

    function handleChangeSmarter2(event) {
        const selectedOption = event.target.value;
        if (selectedOption === "Nessuno smarter selezionato") setSmarter2(null);
        else setSmarter2(selectedOption);
    }

    function handleChangeModalita(event) {
        const selectedOption = event.target.value;
        if (selectedOption === "Nessuna modalità selezionata") {
            setModalita(null);
        } else {
            if (selectedOption === "Low positive interdependence")
                setModalita(1);
            else if (selectedOption === "High positive interdependence")
                setModalita(2);
        }
    }

    async function handleConferma() {
        setSwalPopup(true);
        if (smarter1 === null || smarter2 === null) {
            Swal.fire({
                icon: "error",
                title: "Selezionare entrambi gli smarter",
            }).then(() => {
                setSwalPopup(false);
            });
            return;
        }
        if (modalita === null) {
            Swal.fire({
                icon: "error",
                title: "Selezionare una modalità",
            }).then(() => {
                setSwalPopup(false);
            });
            return;
        }
        if (smarter1 === smarter2) {
            Swal.fire({
                icon: "error",
                title: "Selezionare due smarter diversi",
            }).then(() => {
                setSwalPopup(false);
            });
            return;
        }

        const data = {
            selectedSmarters: [smarter1, smarter2],
            mode: modalita,
            classId: classId,
        };
        try {
            const result = await axios({
                method: "post",
                url: url + "/user/saveSmarterModeClass",
                data: data,
                headers: { Authorization: "Bearer " + token },
            });
            // console.log(result.data);

            if (router.asPath === "/home") router.push("/mockup/profilo");
            //Close the popup
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div
                className={`${
                    show ? "scale-100" : "scale-0"
                } transition-transform duration-300 ease-in-out fixed inset-0 z-50`}
            >
                <section className="modal-main rounded-2xl" ref={popUpRef}>
                    <div className="flex flex-col items-center">
                        <h1 className="text-grayText text-4xl mt-4 mb-10">
                            SELEZIONA GLI SMARTER
                        </h1>

                        <div className="flex flex-row items-center gap-x-10 mb-4">
                            <h1 className="text-3xl text-grayText">
                                SMARTER 1
                            </h1>
                            <select
                                className="w-96 h-12 bg-grayLight text-center"
                                onChange={handleChangeSmarter1}
                                defaultValue={selectedSmarters[0]}
                            >
                                <option>Nessuno smarter selezionato</option>
                                {boxes && boxes.length > 0 ? (
                                    boxes.map((box) =>
                                        selectedSmarters[0] === box ? (
                                            <option key={box} value={box}>
                                                {box}
                                            </option>
                                        ) : (
                                            <option key={box} value={box}>
                                                {box}
                                            </option>
                                        )
                                    )
                                ) : (
                                    <option>Non ci sono smarter</option>
                                )}
                            </select>
                        </div>

                        <div className="flex flex-row items-center gap-x-10 mb-4">
                            <h1 className="text-3xl text-grayText">
                                SMARTER 2
                            </h1>
                            <select
                                className="w-96 h-12 bg-grayLight text-center"
                                onChange={handleChangeSmarter2}
                                defaultValue={selectedSmarters[1]}
                            >
                                <option>Nessuno smarter selezionato</option>
                                {boxes && boxes.length > 0 ? (
                                    boxes.map((box) =>
                                        selectedSmarters[1] === box ? (
                                            <option key={box} value={box}>
                                                {box}
                                            </option>
                                        ) : (
                                            <option key={box} value={box}>
                                                {box}
                                            </option>
                                        )
                                    )
                                ) : (
                                    <option>Non ci sono smarter</option>
                                )}
                            </select>
                        </div>

                        <div className="flex flex-row items-center gap-x-10 mb-4">
                            <h1 className="text-3xl text-grayText">
                                MODALITA'
                            </h1>
                            <select
                                className="w-96 h-12 bg-grayLight text-center"
                                onChange={handleChangeModalita}
                                defaultValue={
                                    selectedMode == 1
                                        ? "Low positive interdependence"
                                        : "High positive interdependence"
                                }
                            >
                                <option>Nessuna modalità selezionata</option>
                                <option>Low positive interdependence</option>
                                <option>High positive interdependence</option>
                            </select>
                        </div>

                        <div className="flex flex-row gap-x-6">
                            <div className="grid grid-cols-2 gap-x-4">
                                <button
                                    onClick={handleConferma}
                                    className="h-12 w-56 mt-6 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300"
                                >
                                    Conferma
                                </button>
                                <button
                                    onClick={onClose}
                                    className="h-12 w-56 mt-6 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300"
                                >
                                    Annulla
                                </button>
                            </div>
                        </div>
                        {children}
                    </div>
                </section>
            </div>
        </>
    );
}
