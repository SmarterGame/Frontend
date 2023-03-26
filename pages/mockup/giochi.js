import LayoutSelezioneGiochi from "@/components/LayoutSelezioneGiochi";
import Image from "next/image";
import ghianda from "@/public/ghianda.svg";
import montagna from "@/public/montagnaSMARTER.png";
import orsoFaccia from "@/public/orsoFaccia.svg";
import procioneFaccia from "@/public/procioneFaccia.svg";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import grass from "@/public/grass.png";

export default function Giochi() {
    return (
        <>
            <LayoutSelezioneGiochi>
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

                <div className="flex flex-col items-center mx-auto h-[80%] w-[80%] bg-slate-200 rounded-xl shadow-2xl mt-6">
                    <h1 className="mt-10 text-4xl text-orangeBtn">
                        SCEGLI UN GIOCO
                    </h1>
                    <div className="flex flex-row justify-center items-center h-full">
                        <div className="flex flex-row items-center">
                            <div className="flex flex-col items-center mt-10 gap-y-9">
                                <Image src={procioneFaccia} width={100}></Image>
                                <Image src={procioneFaccia} width={100}></Image>
                                <Image src={procioneFaccia} width={100}></Image>
                            </div>
                            <div className="flex flex-col items-center">
                                <h1 className="text-grayText text-2xl">
                                    LE QUANTITA'
                                </h1>
                                <button>
                                    <div className="flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 h-20 w-20 rounded-full z-auto">
                                        <LockOutlinedIcon
                                            fontSize="large"
                                            className="text-slate-200"
                                        />
                                    </div>
                                </button>
                                <div class="border-2 border-solid border-neutral-500 bg-neutral-500 w-4 h-14 -mt-[3px]"></div>
                                <button>
                                    <div className="flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 h-20 w-20 rounded-full -mt-[3px]">
                                        <LockOutlinedIcon
                                            fontSize="large"
                                            className="text-slate-200"
                                        />
                                    </div>
                                </button>
                                <div class="border-2 border-solid border-neutral-500 bg-neutral-500 w-4 h-14 -mt-[2px]"></div>
                                <button className="">
                                    <div className="flex justify-center items-center text-neutral-500 text-lg bg-yellowLevel hover:bg-orange-400 h-20 w-20 rounded-full -mt-1 z-10">
                                        Liv. 1
                                    </div>
                                </button>
                            </div>
                        </div>

                        <Image
                            src={montagna}
                            width={800}
                            className="self-end"
                        ></Image>

                        <div className="flex flex-row">
                            <div className="flex flex-col items-center">
                                <h1 className="text-grayText text-2xl">
                                    ORDINAMENTI
                                </h1>
                                <button>
                                    <div className="flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 h-20 w-20 rounded-full z-auto">
                                        <LockOutlinedIcon
                                            fontSize="large"
                                            className="text-slate-200"
                                        />
                                    </div>
                                </button>
                                <div class="border-2 border-solid border-neutral-500 bg-neutral-500 w-4 h-14 -mt-[3px]"></div>
                                <button>
                                    <div className="flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 h-20 w-20 rounded-full -mt-[3px]">
                                        <LockOutlinedIcon
                                            fontSize="large"
                                            className="text-slate-200"
                                        />
                                    </div>
                                </button>
                                <div class="border-2 border-solid border-neutral-500 bg-neutral-500 w-4 h-14 -mt-[2px]"></div>
                                <button className="">
                                    <div className="flex justify-center items-center text-neutral-500 text-lg bg-yellowLevel hover:bg-orange-400 h-20 w-20 rounded-full -mt-1 z-10">
                                        Liv. 1
                                    </div>
                                </button>
                            </div>
                            <div className="flex flex-col items-center mt-7 gap-y-9">
                                <Image src={orsoFaccia} width={100}></Image>
                                <Image src={orsoFaccia} width={100}></Image>
                                <Image src={orsoFaccia} width={100}></Image>
                            </div>
                        </div>
                    </div>
                </div>

                <Image src={grass} className="w-full object-fill -mt-[51px]" />
            </LayoutSelezioneGiochi>
        </>
    );
}
