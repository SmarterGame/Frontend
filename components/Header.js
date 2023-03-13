//import Link from 'next/link'

const Header = ({ user, loading }) => {
  return (
    <header>
      <nav>
          {/* !loading &&
            (user ? (
              <button>
                <a href="/api/auth/logout">Logout</a>
              </button>
            ) : (
              <button>
                <a href="/api/auth/login">Login</a>
              </button>
          )) */}
      </nav>
    </header>
  )
}

export default Header
