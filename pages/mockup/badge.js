import LayoutGames from "@/components/LayoutGames";
import Image from "next/image";
import ghianda from "@/public/ghianda.svg";

export default function Badge() {
    return (
        <>
            <LayoutGames>
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
