import { useRef, useEffect } from "react";

export default function PopUp({ show, onClose, children }) {
    //Check if the modal is open or not
    const showHideClassName = show
        ? "modal display-block"
        : "modal display-none";

    const popUpRef = useRef(null);

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
    }, [popUpRef, show]);

    return (
        <>
            <div className={`${show ? 'scale-100' : 'scale-0'} transition-transform duration-300 ease-in-out fixed inset-0 z-50`}>
                <section className="modal-main rounded-2xl" ref={popUpRef}>
                    <div className="flex flex-col items-center">
                        <h1 className="text-grayText text-4xl mt-4 mb-10">
                            SELEZIONA GLI SMARTER
                        </h1>

                        <div className="flex flex-row items-center gap-x-10 mb-4">
                            <h1 className="text-3xl text-grayText">
                                SMARTER 1
                            </h1>
                            <select className="w-96 h-12 bg-grayLight text-center">
                                <option className="">
                                    Nessuno smarter selezionato
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-row items-center gap-x-10 mb-4">
                            <h1 className="text-3xl text-grayText">
                                SMARTER 2
                            </h1>
                            <select className="w-96 h-12 bg-grayLight text-center">
                                <option className="">
                                    Nessuno smarter selezionato
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-row items-center gap-x-10 mb-4">
                            <h1 className="text-3xl text-grayText">
                                MODALITA'
                            </h1>
                            <select className="w-96 h-12 bg-grayLight text-center">
                                <option className="">
                                    High positive interdependence
                                </option>
                                <option className="">
                                    Low positive interdependence
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-row gap-x-6">
                            <div className="grid grid-cols-2 gap-x-4">
                                <button
                                    onClick={onClose}
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
                                <button className="h-12 w-56 mt-6 transition ease-in-out bg-red-600 hover:bg-red-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300">
                                    Logout
                                </button>
                                <button className="h-12 w-56 mt-6 transition ease-in-out bg-slate-600 hover:bg-slate-700 hover:-translatey-1 hover:scale-110 text-white text-xl shadow-2xl rounded-md duration-300">
                                    Cambia classe
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
