import Link from 'next/link'

const Header = ({ user, loading }) => {
  return (
    <header>
      <nav>
        <div className="flex flex-row justify-between bg-blue-600 shadow-2xl h-auto">
            <Link href="/">
                <h1 className="text-4xl font-bold text-gray-100 text-stroke-orange mt-4 mb-4 ml-4">
                    THE SMART GAME
                </h1>
            </Link>
           <button className="bg-orangeBtn hover:bg-orange-600 text-gray-100 font-bold shadow-2xl mr-10 mt-4 mb-4 px-4 rounded-md">
              {user ? (
                <button>
                  <Link href="/api/auth/logout">Esci</Link>
                </button>
                  ) : (
                <button>
                  <Link href="/api/auth/login">Accedi</Link>
                </button>
              )}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header
