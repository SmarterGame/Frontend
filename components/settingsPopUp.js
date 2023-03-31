import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function PopUp({ show, onClose, children, boxes }) {
    const router = useRouter();

    const popUpRef = useRef(null);

    const [smarter1, setSmarter1] = useState(null);
    const [smarter2, setSmarter2] = useState(null);
    const [modalita, setModalita] = useState(null);

    //Check if the click was outside of the modal
    useEffect(() => {
        function handleClickOutside(event) {
            //If the click was outside of the modal, close it
            if (popUpRef.current && !popUpRef.current.contains(event.target)) {
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
    }, [show]);

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
        setModalita(selectedOption);
    }

    function handleConferma() {
        if (smarter1 === null && smarter2 === null) {
            Swal.fire({
                icon: "error",
                title: "Selezionare almeno uno smarter",
            });
            return;
        }

        if (smarter1 === smarter2) {
            Swal.fire({
                icon: "error",
                title: "Selezionare due smarter diversi",
            });
            return;
        }

        /*
        Dati da inviare al backend:
            smarter1
            smarter2
            modalita
        */

        router.push("/mockup/profilo");
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
                            >
                                <option>Nessuno smarter selezionato</option>
                                {boxes && boxes.length > 0 ? (
                                    boxes.map((box) => (
                                        <option key={box} value={box}>
                                            {box}
                                        </option>
                                    ))
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
                            >
                                <option>Nessuno smarter selezionato</option>
                                {boxes && boxes.length > 0 ? (
                                    boxes.map((box) => (
                                        <option key={box} value={box}>
                                            {box}
                                        </option>
                                    ))
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
                            >
                                <option>High positive interdependence</option>
                                <option>Low positive interdependence</option>
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
