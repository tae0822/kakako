import { Link, useNavigate } from "react-router-dom"

function Navbar({token, userName, setToken, setUsername}: {token: string | null, userName: string | null, setToken: React.Dispatch<React.SetStateAction<string | null>>, setUsername: React.Dispatch<React.SetStateAction<string | null>>}) {

// const [token, setToken] = useState(localStorage.getItem("token"))
// const [userName, setUsername] = useState(localStorage.getItem("<userName></userName>"))

  const navigate = useNavigate()

  const logout =()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("userId") // 로컬스토리지에 저장한 userId도 같이 비워주는 것이 좋습니다.
    setToken(null)
    setUsername(null)
    navigate("/login")
  }

  return (
    <nav className="flex justify-between items-center h-16 px-6 bg-white border-b border-gray-200">
        {/* 로고 영역 */}
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-950">
            Kokoa
        </Link>
        
        {/* 메뉴 영역 */}
        <div className="text-sm font-medium">
            {token ? (
            <div className="flex items-center gap-6">
                <span className="text-gray-500">
                <strong className="text-gray-900 font-semibold">{userName}</strong>님 환영합니다!
                </span>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
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
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                로그인
                </Link>
                <Link 
                to="/register" 
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
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