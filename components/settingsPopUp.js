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
            <div className={`${showHideClassName}`}>
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
                                SMARTER 1
                            </h1>
                            <select className="w-96 h-12 bg-grayLight text-center">
                                <option className="">
                                    Nessuno smarter selezionato
                                </option>
                            </select>
                        </div>

                        <button
                            onClick={onClose}
                            className="h-12 w-56 mt-6 transition ease-in-out bg-orangeBtn hover:bg-orange-700 hover:-translatey-1 hover:scale-110 text-white text-3xl shadow-2xl rounded-md duration-300"
                        >
                            Entra
                        </button>
                        {children}
                    </div>
                </section>
            </div>
        </>
    );
}