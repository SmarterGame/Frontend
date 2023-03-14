import Link from "next/link";

const Header = ({ user, loading }) => {
    return (
        <header>
            <nav>
                <div className="flex flex-row justify-between bg-blue-600 shadow-2xl h-auto">
                    <Link href="/">
                        <h1 className="transition ease-in-out delay-150 text-4xl font-bold text-gray-100 text-stroke-orange mt-4 mb-4 ml-6 hover:-translatey-1 hover:scale-110 duration-300">
                            THE SMART GAME
                        </h1>
                    </Link>
                    <button className="transition ease-in-out delay-150 bg-orangeBtn hover:bg-orange-600 hover:-translatey-1 hover:scale-110 text-gray-100 font-bold shadow-2xl mr-10 mt-4 mb-4 px-4 rounded-md duration-300">
                        {user ? (
                            <Link href="/api/auth/logout">Esci</Link>
                        ) : (
                            <Link href="/api/auth/login">Accedi</Link>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
