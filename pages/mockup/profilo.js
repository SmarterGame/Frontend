import Layout from "../../components/Layout";

export default function Profilo() {
    return (
        <>
            <Layout>
                <div className="flex flex-col  mx-auto h-[70%] w-1/2 bg-slate-200 mt-6 rounded-xl shadow-2xl">
                    <div className="relative">
                        <h1 className="absolute top-11 right-40 text-2xl text-slate-700">
                            x 56
                        </h1>
                        <div className="absolute top-4 right-14 w-20 h-20 bg-gray-700 rounded-full"></div>
                    </div>

                    <div className="w-40 h-40 mx-auto bg-gray-700 rounded-full mt-10 shadow-xl"></div>

                    {/* <div class="bg-yellow-500 h-4 w-[60%] mx-auto animate-pulse mt-10 rounded-2xl"></div> */}
                    <div class="mx-auto bg-slate-400 h-4 w-[60%] mt-10 rounded-full">
                        <div class="bg-yellow-400 h-4 rounded-full w-[50%] animate-pulse"></div>
                    </div>

                    <div className="mx-auto">
                        <h1 className=" text-orangeBtn text-4xl mt-10">
                            Scoiattoli livello 3
                        </h1>
                        <div className="flex flex-col h-full mt-6">
                            <button className=" mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[50%] h-[25%] rounded-md duration-300">
                                Badge
                            </button>
                            <br></br>
                            <button className="mx-auto transition ease-in-out bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 text-2xl font-bold shadow-2xl w-[50%] h-[25%] rounded-md duration-300">
                                Sfide
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
