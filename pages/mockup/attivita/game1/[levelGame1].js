import LayoutGames from "@/components/LayoutGames";
import Image from "next/image";
import leone from "@/public/leone.svg";
import { useRouter } from "next/router";

export default function Game1() {
    const router = useRouter();
    const { levelGame1, game } = router.query;

    return (
        <>
            <LayoutGames title={game} liv={levelGame1}>
                <div className="flex flex-row justify-center gap-x-20 w-full">
                    <div className="flex flex-col justify-center h-screen max-h-[550px] w-[45%] mt-10 ml-4 mr-4">
                        <h1 className="mx-auto text-xl -mt-4 mb-4 text-grayText">
                            Smarter 1
                        </h1>
                        <div class="grid grid-cols-5 justify-items-center gap-y-4 gap-x-4 h-full">
                            {Array.from({ length: 5 }, (_, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-200 border-4 hover:border-green-500 w-full flex justify-center items-center text-8xl"
                                >
                                    {index}
                                </div>
                            ))}
                            {Array.from({ length: 5 }, (_, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-200 border-4 hover:border-green-500 w-full flex justify-center items-center text-8xl"
                                >
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="self-end border-2 border-dashed border-gray-700 w-0 h-[700px] mt-6"></div>

                    <div className="flex flex-col justify-center h-screen max-h-[550px] w-[45%] mt-10 ml-4 mr-4">
                        <h1 className="mx-auto text-xl -mt-4 mb-4 text-grayText">
                            Smarter 2
                        </h1>
                        <div class="grid grid-cols-5 justify-items-center gap-y-4 gap-x-4 h-full">
                            {Array.from({ length: 10 }, (_, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-200 border-4 hover:border-green-500 w-full flex justify-center items-center text-8xl"
                                >
                                    {index}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-40">
                    <Image src={leone}></Image>
                </div>
            </LayoutGames>
        </>
    );
}
