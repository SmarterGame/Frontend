import LayoutGames from "../../components/LayoutGames";
import Image from "next/image";
import ghianda from "../../public/ghianda.svg";

export default function Game() {
    return (
        <>
            <LayoutGames>
                <header>
                    <nav>
                        <div className="flex flex-row justify-between bg-blue-600 shadow-2xl h-auto py-2">
                            <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                                LE QUANTITA' - LIVELLO X
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

                <div className="flex flex-col justify-center h-screen max-h-[550px] mt-10 ml-4 mr-4">
                    <div class="grid grid-cols-10 justify-items-center gap-y-4 gap-x-4 h-full">
                        {Array.from({ length: 20 }, (_, index) => (
                            <div
                                key={index}
                                className="bg-slate-200 border-4 hover:border-green-500 w-full flex justify-center items-center text-8xl"
                            >
                                {index}
                            </div>
                        ))}
                    </div>
                </div>
            </LayoutGames>
        </>
    );
}
