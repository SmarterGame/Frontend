import LayoutGames from "@/components/LayoutGames";
import Image from "next/image";
import ghianda from "@/public/ghianda.svg";

export default function Badge() {
    return (
        <>
            <LayoutGames>
                <header>
                    <nav>
                        <div className="flex flex-row justify-between bg-blue-600 shadow-2xl h-auto py-2">
                            <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                                GIOCHI
                            </h1>
                            <div className="flex flex-row items-center">
                                <h1 className="text-4xl text-slate-100 mr-4">
                                    5
                                </h1>
                                <Image src={ghianda} width={60}></Image>
                                <div className="w-20 h-20 bg-gray-700 rounded-full ml-4 mr-4"></div>
                            </div>
                        </div>
                    </nav>
                </header>

                <div className="flex flex-row items-center justify-center mx-auto gap-x-10 h-[50%] w-[50%] bg-slate-200 rounded-xl shadow-2xl mt-6 ml-32">
                    <div className="flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 h-52 w-52 rounded-full z-auto"></div>
                    <div className="flex flex-col items-center self-center">
                        <h1>CONGRATULAZIONI!</h1>
                        <h1>AVETE VINTO UN ALTRO BADGE</h1>
                        <h1>COLLEZIONISTI DI GHIANDE LVL 3</h1>
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
