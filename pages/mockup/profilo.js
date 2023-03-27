import LayoutProfile from "../../components/LayoutProfile";
import Image from "next/image";
import Link from "next/link";
import ghianda from "../../public/ghianda.svg";

export default function Profilo() {
    return (
        <>
            <LayoutProfile>
                <div className="flex flex-col mx-auto h-[70%] w-1/2 bg-slate-200 rounded-xl shadow-2xl mt-10">
                    <div className="relative">
                        <h1 className="absolute top-8 right-32 text-2xl text-slate-700">
                            x 5
                        </h1>
                        <Image
                            src={ghianda}
                            width={60}
                            className="absolute top-4 right-14"
                        />
                    </div>

                    <div className="w-40 h-40 mx-auto bg-gray-700 rounded-full mt-10 shadow-xl"></div>

                    <div class="mx-auto bg-slate-400 h-4 w-[60%] mt-14 rounded-full">
                        <div class="bg-yellow-400 h-4 rounded-full w-[50%]"></div>
                    </div>

                    <div className="mx-auto">
                        <h1 className=" text-orangeBtn text-4xl mt-14">
                            Scoiattoli livello 3
                        </h1>
                        <div className="flex flex-col h-full mt-14">
                            <button className=" mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[50%] h-[25%] rounded-md duration-300">
                                <Link href="./missioni">BADGE</Link>
                            </button>
                            <br></br>
                            <button className="mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[50%] h-[25%] rounded-md duration-300">
                                <Link href="./attivita">GIOCHI</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutProfile>
        </>
    );
}
