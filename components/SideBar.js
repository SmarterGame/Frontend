import Link from "next/link";

export default function SiedBar({ show, children }) {
    return (
        <>
            <div className={`${show ? 'translate-x-0' : 'translate-x-full'} transition duration-300 fixed top-0 right-0 h-full px-6 bg-gray-400 shadow-2xl`}>
                <div className="flex flex-col gap-y-6 mt-4">
                    {children}
                    <button className="h-10 w-52 transition ease-in-out bg-red-500 hover:bg-red-600 hover:-translatey-1 hover:scale-110 text-white shadow-2xl rounded-md duration-300">
                        <Link href="/api/auth/logout">ESCI</Link>
                    </button>
                </div>
            </div>
        </>
    );
}
