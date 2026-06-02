import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleRegister = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(""); // 요청 전 에러 초기화


      try {
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            })
            
            const data = await res.json()
            
            if (!res.ok) {
                setError(data.error || "회원가입에 실패했습니다.")
            } else {
                console.log("가입 완료. 생성된 유저 정보:", data)
                // 가입 성공 후 로그인 페이지로 이동 (또는 원하는 페이지로 변경 가능)
                navigate("/login") 
            }
        } catch (err) {
            setError("서버와의 통신이 원활하지 않습니다.")
        }
    }
    

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-80 bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-lg font-medium mb-1">회원가입</h2>
                <p className="text-sm text-gray-400 mb-6">새로운 계정을 생성하세요</p>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-500">사용자 이름</label>
                        <input
                            type="text"
                            placeholder="username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-500">이메일</label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-500">비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="h-10 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 mt-1"
                    >
                        가입하기
                    </button>
                </form>

                <div className="text-center text-xs text-gray-400 mt-4">
                    이미 계정이 있으신가요?{" "}
                    <a href="/login" className="text-blue-500">로그인</a>
                </div>
            </div>
        </div>
    )       
}

export default Register