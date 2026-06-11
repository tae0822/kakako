import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Chat from "./Chat"
import Register from "./Register"
import Login from "./Login"
import Navbar from './Navbar.tsx'
import { useState, type ReactNode } from "react"
import { useTheme } from "./useTheme"

function ProtectedRoute({ token, children }: { token: string | null; children: ReactNode }) {
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const ROOM_NUMBER = 5
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [userName, setUsername ] = useState(localStorage.getItem("username"))
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null
  )
  const [currentRoom, setCurrentRoom] = useState<number>(1)
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
        <Navbar token={token} userName={userName} setToken={setToken} setUsername={setUsername} theme={theme} toggleTheme={toggleTheme}/>
        {token && (
        <div className="flex justify-center px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50">
          <div className="flex flex-col items-center gap-3 w-full max-w-xl">
            <p className="text-xs font-medium tracking-wide text-gray-400 dark:text-gray-500 uppercase">
              채팅방 선택
            </p>
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
              {Array.from({ length: ROOM_NUMBER }, (_, i) => i + 1).map((roomNumber) => {
                const isActive = currentRoom === roomNumber
                return (
                  <button
                    key={roomNumber}
                    type="button"
                    onClick={() => setCurrentRoom(roomNumber)}
                    className={[
                      "min-w-[4.5rem] px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer",
                      isActive
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-md scale-[1.02]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700",
                    ].join(" ")}
                  >
                    {roomNumber}번 방
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
        <Routes>
          <Route path="/" element={
            <ProtectedRoute token={token}>
              <Chat userId={userId} roomId={currentRoom}/>
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} setUsername={setUsername} setUserId={setUserId}/>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
