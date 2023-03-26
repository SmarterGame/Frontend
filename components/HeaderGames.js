import Image from "next/image";
import ghianda from "../public/ghianda.png";

export default function HeaderGames({ user, loading }) {
    return (
        <>
            <header>
                <nav>
                    <div className="flex flex-row justify-between bg-blue-600 shadow-2xl h-auto py-2">
                        <h1 className="pl-4 transition ease-in-out text-4xl text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                            LE QUANTITA' - LIVELLO X
                        </h1>
                        <div className="flex flex-row items-center">
                            <h1 className="text-4xl text-slate-100 mr-4">5</h1>
                            <Image src={ghianda} width={60}></Image>
                            <div className="w-20 h-20 bg-gray-700 rounded-full ml-4 mr-4"></div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
