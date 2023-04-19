import { useState } from "react";

export default function Home({ token, url, show, onClose, boxes }) {
    const [isChecked, setIsChecked] = useState(Array(boxes.length).fill(false));

    const handleConferma = () => {
        console.log(isChecked);
    };

    const handleCheckboxChange = (event, index) => {
        const newArray = [...isChecked];
        newArray[index] = event.target.checked;
        setIsChecked(newArray);
        // setIsChecked((prevState) => {
        //     const newState = [...prevState];
        //     newState[index] = event.target.checked;
        //     return newState;
        // });
        // setIsChecked(event.target.checked);
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
                        <h1 className="text-grayText text-4xl mt-4 mb-10">
                            SELEZIONA GLI SMARTER
                        </h1>
                        <div>
                            <label>
                                {boxes && boxes.length > 0 ? (
                                    boxes.map((box, index) => (
                                        <div key={box}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked[index]}
                                                onChange={() =>
                                                    handleCheckboxChange(index)
                                                }
                                            />
                                            {box}
                                        </div>
                                    ))
                                ) : (
                                    <p>Non ci sono box</p>
                                )}
                            </label>
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
                    </div>
                </section>
            </div>
        </>
    );
}
