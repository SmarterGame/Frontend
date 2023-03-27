export default function Badge() {
    return (
        <>
            <div className="flex felx-row items-center justify-center gap-x-6 w-full mt-6">
                <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
                <div className="flex flex-col bg-slate-100 w-1/2 h-[60%] rounded-xl">
                    <h1 className="mx-auto text-lg text-orangeBtn mt-2">
                        COLLEZIONISTI DI GHIANDE - LIVELLO 3
                    </h1>
                    <h2 className="mx-auto text-md text-slate-500 mt-6">
                        RACCOGLI 50 GHIANDE
                    </h2>
                </div>
            </div>
        </>
    );
}
