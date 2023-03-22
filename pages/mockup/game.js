import Layout from "../../components/Layout";
import Image from "next/image";
import fiore from "../../public/fiore.jpg";

export default function Game() {
    return (
        <>
            <Layout>
                <div className="flex flex-col justify-center h-screen max-h-[700px] mt-6 ml-4 mr-4">
                    <div class="grid grid-cols-10 justify-items-center gap-y-4 gap-x-4 h-full">
                        {Array.from({ length: 20 }, (_, index) => (
                            <div
                                key={index}
                                className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl"
                            >
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </div>
                        ))}
                        {/* <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">01</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">02</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">03</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">04</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">05</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center  text-8xl">
                            <Image src={fiore} className="w-20"></Image>
                        </div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">07</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">08</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">09</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">10</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">11</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">12</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">13</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">
                            {/* <Image src={fiore} className="h-full object-cover"></Image> }
                        </div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">15</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">16</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">17</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">18</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">19</div>
                        <div className="bg-slate-200 border-4 border-green-500 w-full flex justify-center items-center text-8xl">20</div> */}
                    </div>
                </div>

                <div className="fixed bottom-0 bg-green-600 w-full h-screen max-h-[10%]"></div>
            </Layout>
        </>
    );
}
