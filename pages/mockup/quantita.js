import LayoutGames from "../../components/LayoutGames";

export default function Quantita() {
    return (
        <>
            <LayoutGames>
                <div className="flex flex-col mx-auto h-[70%] w-1/2 bg-slate-200 rounded-xl shadow-2xl">
                    <div className="flex flex-col items-center h-full mt-6">
                        <h1 className="text-4xl text-orangeBtn">
                            LE QUANTITA' - LIVELLO 4
                        </h1>
                        <h2 className="text-2xl text-slate-700 mt-12">
                            GHIANDE
                        </h2>

                        <div className="flex flex-row">
                            <p className="text-xl text-slate-700 mt-12">X</p>
                            <h1 className=" text-6xl text-slate-700 mt-5 ml-1">
                                24
                            </h1>
                            <div className="w-20 h-20 bg-gray-700 rounded-full ml-4 mt-5"></div>
                        </div>

                        <div class="mx-auto bg-slate-300 h-1 w-[60%] mt-10 rounded-full"></div>

                        <h1 className="text-2xl text-slate-700 mt-8">BADGE</h1>

                        <div className="w-20 h-20 bg-gray-700 rounded-full mt-5"></div>

                        <div className="flex flex-row justify-center gap-x-4 w-full mt-10">
                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] h-[140%] rounded-md duration-300">
                                SFIDE
                            </button>
                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] h-[140%] rounded-md duration-300">
                                PROFILO
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
