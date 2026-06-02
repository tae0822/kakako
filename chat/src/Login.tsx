import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login({setToken, setUsername, setUserId}: 
    {setToken: React.Dispatch<React.SetStateAction<string | null>>,
    setUsername: React.Dispatch<React.SetStateAction<string | null>>,
    setUserId: React.Dispatch<React.SetStateAction<number | null>>}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    const navigate = useNavigate()

    const handleLogin = async(e: React.FormEvent)=>{
        e.preventDefault();

        const res = await fetch("http://localhost:3000/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        })

        const data = await res.json()
        console.log("로그인 시도 결과 from LoginPage:", data)
        if(!res.ok){
            setError(data.error)
        } else {
            localStorage.setItem("token", data.token) // JWT 토큰을 로컬 스토리지에 저장
            localStorage.setItem("username", data.user.username) // 사용자 ID를 로컬 스토리지에 저장
            localStorage.setItem("userId", data.user.id) // 사용자 ID를 로컬 스토리지에 저장
            setToken(data.token) // App 컴포넌트의 상태에도 토큰 저장
            setUsername(data.user.username) // App 컴포넌트의 상태에도 사용자 ID 저장
            setUserId(data.user.id) // App 컴포넌트의 상태에도 사용자 ID 저장
            navigate("/") // 메인 페이지로 이동
        }
    }


  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-80 bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-lg font-medium mb-1">로그인</h2>
        <p className="text-sm text-gray-400 mb-6">계속하려면 로그인하세요</p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400"
            />
          </div>

          <button
            type="submit"
            className="h-10 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 mt-1"
          >
            로그인
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 mt-4">
          계정이 없으신가요?{" "}
          <a href="/register" className="text-blue-500">회원가입</a>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login