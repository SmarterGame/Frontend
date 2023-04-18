import Link from "next/link";

export default function SiedBar({ show, children }) {
    return (
        <>
            <div
                className={`${
                    show ? "translate-x-0" : "translate-x-full"
                } transition duration-300 fixed top-0 right-0 h-full bg-gray-200 shadow-2xl`}
            >
                <div className="flex flex-col mt-4 px-3 gap-y-2 h-full">
                    <div className="flex border-b-2 border-gray-300 mb-1 text-3xl">
                        <h1 className="mx-auto text-orangeBtn mb-2">Smart Game</h1>
                    </div>
                    {children}
                    <div className="border-t-2 border-gray-300 mt-1"></div>
                    <div className="py-2 hover:bg-red-300 hover:bg-opacity-70 rounded-md mt-auto mb-10">
                        <button className="h-full w-full transition ease-in-out text-gray-600 text-xl">
                            <Link href="/api/auth/logout">ESCI</Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
