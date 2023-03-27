import LayoutGames from "../../components/LayoutGames";
import Image from "next/image";
import Link from "next/link";
import ghianda from "@/public/ghianda.svg";

export default function Quantita() {
    return (
        <>
            <LayoutGames>
                <div className="flex flex-col mx-auto h-[70%] w-1/2 bg-slate-200 rounded-xl shadow-2xl mt-10">
                    <div className="flex flex-col items-center h-full mt-6">
                        <h1 className="text-4xl text-orangeBtn">
                            LE QUANTITA' - LIVELLO 4
                        </h1>
                        <h2 className="text-2xl text-slate-700 mt-12">
                            GHIANDE
                        </h2>

                        <div className="flex flex-row items-center gap-x-2 mt-6">
                            <p className="text-xl text-slate-700 mt-6">X</p>
                            <h1 className=" text-6xl text-slate-700 ml-1">2</h1>
                            <Image src={ghianda} width={100} />
                        </div>

                        <div class="mx-auto bg-slate-300 h-1 w-[60%] mt-10 rounded-full"></div>

                        <h1 className="text-2xl text-slate-700 mt-8">BADGE</h1>
                        <button>
                            <div className="flex justify-center items-center w-24 h-24 bg-yellow-300 rounded-full mt-5">
                                <div className="flex justify-center items-center w-20 h-20 bg-rose-300 rounded-full">
                                    <Image src={ghianda} width={50} />
                                </div>
                            </div>
                        </button>

                        <div className="flex flex-row justify-center gap-x-4 w-full mt-10">
                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] py-3 rounded-md duration-300">
                                <Link href="./attivita">GIOCHI</Link>
                            </button>

                            <button className="transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[20%] py-3 rounded-md duration-300">
                                <Link href="./profilo">PROFILO</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
