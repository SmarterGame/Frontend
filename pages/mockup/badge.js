import LayoutGames from "@/components/LayoutGames";
import Image from "next/image";
import Link from "next/link";
import ghianda from "@/public/ghianda.svg";

export default function Badge() {
    return (
        <>
            <LayoutGames>
                <div className="flex flex-col items-center h-[50%] w-full mt-28 -m-72">
                    <div className="flex flex-row items-center justify-center gap-x-10 h-[90%] px-10 bg-slate-200 rounded-xl shadow-2xl ">
                        <div className="flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 h-52 w-52 rounded-full z-auto"></div>
                        <div className="flex flex-col items-center self-center gap-y-6">
                            <h1 className="text-grayText text-2xl">
                                CONGRATULAZIONI!
                            </h1>
                            <h1 className="text-grayText text-2xl">
                                AVETE VINTO UN NUOVO BADGE:
                            </h1>
                            <h1 className="text-orangeBtn text-3xl">
                                COLLEZIONISTI DI GHIANDE LVL 3
                            </h1>
                        </div>
                    </div>

                    <div className="flex mt-10 gap-x-6">
                        <button className="py-3 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./attivita">GIOCHI</Link>
                        </button>
                        <button className="py-3 w-52 transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl rounded-md duration-300">
                            <Link href="./profilo">PROFILO</Link>
                        </button>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
