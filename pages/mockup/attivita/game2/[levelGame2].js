import LayoutGames from "@/components/LayoutGames";

export default function Game() {
    return (
        <>
            <LayoutGames>
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
