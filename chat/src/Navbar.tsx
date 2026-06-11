import { Link, useNavigate } from "react-router-dom"

function Navbar({
  token,
  userName,
  setToken,
  setUsername,
  theme,
  toggleTheme,
}: {
  token: string | null
  userName: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  setUsername: React.Dispatch<React.SetStateAction<string | null>>
  theme: "light" | "dark"
  toggleTheme: () => void
}) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    setToken(null)
    setUsername(null)
    navigate("/login")
  }

  return (
    <nav className="flex justify-between items-center h-16 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <Link to="/" className="text-xl font-bold tracking-tight text-gray-950 dark:text-gray-100">
        Kokoa
      </Link>

      <div className="flex items-center gap-4 text-sm font-medium">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {token ? (
          <div className="flex items-center gap-6">
            <span className="text-gray-500 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100 font-semibold">{userName}</strong>님 환영합니다!
            </span>
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              채팅하기
            </Link>
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 font-medium cursor-pointer transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
