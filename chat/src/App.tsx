import { BrowserRouter, Route, Routes } from "react-router-dom"
import Chat from "./Chat"
import Register from "./Register"
import Login from "./Login"
import Navbar from './Navbar.tsx'
import { useState } from "react"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [userName, setUsername ] = useState(localStorage.getItem("username"))
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null
  )

  return (
    <BrowserRouter>
        <Navbar token={token} userName={userName} setToken={setToken} setUsername={setUsername}/>
        <Routes>
          <Route path="/" element={<Chat userId={userId}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} setUsername={setUsername} setUserId={setUserId}/>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
