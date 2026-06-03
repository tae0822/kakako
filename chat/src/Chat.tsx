import { useEffect, useRef, useState } from "react"
// import { socket } from '../../server/socket'
// import { useNavigate } from "react-router-dom"
import { socket } from "./server/socket"

interface User{
  id: number
  username: string
  email: string
}

interface Message{
  id: number
  text: string
  userId: number
  createdAt: string
  user: User
}

function Chat({userId} : {userId: number | null}) {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  // 🎨 화면 UI 구별용 (F12로 조작해도 내 화면만 바뀔 뿐 서버는 안전!)
  // const navigate = useNavigate()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = ()=>{
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(()=>{
    scrollToBottom()
  },[messages])

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  socket.auth = { token };
  socket.connect();

  return () => {
    socket.disconnect(); // 컴포넌트 언마운트 시에만 연결 해제
  };
}, []); // 👈 의존성 비우기 (마운트 시 딱 한 번만!)

  useEffect(() => {
    // const token = localStorage.getItem("token")
    // const storedUserId = localStorage.getItem("userId")
    const username = localStorage.getItem("username")
    // const storedUserId = localStorage.getItem("userId")
    
    // 💡 [핵심 수정] 부모가 준 userId가 아직 null이더라도, 
    // 로컬스토리지에 직접 확인해 보니 userId가 존재한다면 쫓아내지 않고 기다려줍니다!
    // const hasUserId = userId || localStorage.getItem("userId")

    // 🔐 로그인 상태가 아니면 튕겨내기
    // if (!token || !storedUserId) {
    //   alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.")
    //   navigate('/login')
    //   return
    // }

    // socket.auth = { token }

    // 🔌 소켓 연결
    // socket.connect()

    // socket.emit("user_join", username) // 소켓 연결 시 서버에 유저 이름도 함께 알리기

    socket.on("connect", () => {
      console.log("소켓 연결 성공! 서버에 유저 이름 알림");
      // socket.emit("user_join", username);
    });

    socket.on("online_users", (users: string[])=>{
      setOnlineUsers(users)
    })

    socket.on("previous_messages", (data: any)=>{
      console.log("previous_messages 받음:", data)  // 👈 추가
      setMessages(data)
    })

    socket.on("receive_message", (data: any) => {
      console.log("receive_message 받음:", data)  // 👈 추가
      setMessages((prev) => [...prev, data])
    })

    //  // 👈 이벤트 등록 후 서버에 다시 요청
    // socket.emit("get_previous_messages")


    return () => {
      socket.off("connect")
      socket.off("online_users")
      socket.off("previous_messages")
      socket.off("receive_message")
      socket.disconnect()

    }
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault() // form 제출 시 페이지 새로고침 방지

    if (!message.trim()) return

    socket.emit("send_message", {
      text: message,
      // userId: Number(localStorage.getItem("userId")) // socket으로 대체. 👈 나중에 로그인 기능이 생기면 이 부분도 동적으로 바꿔주기!
    })

    setMessage("")
  }

  return (
    <div className="flex">
   <div className="chat-container" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2> 실시간 채팅방</h2>
      <hr />
      
      {/* 💬 메시지 창 기록 영역 */}
      <div className="message-box" style={{ height: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "15px", borderRadius: "8px" }}>
        {messages.map((msg) => {
          // 내가 보낸 메시지인지 여부 판별
          // const isMine = msg.userId === userId
          const currentUserId = userId || Number(localStorage.getItem("userId"));
          const isMine = msg.userId === currentUserId;

          if (msg.id === messages[0]?.id) { // 첫 번째 메시지만 딱 한 번만 찍도록
          console.log("현재 userId 상태:", userId);
          console.log("localStorage userId:", localStorage.getItem("userId"));
          console.log("비교 대상(msg.userId):", msg.userId);
          console.log("결과(isMine):", isMine);
        }

          return (
            <div 
              key={msg.id || msg.createdAt} 
              className={isMine ? "message my-message" : "message other-message"}
              style={{
                textAlign: isMine ? "right" : "left",
                margin: "10px 0"
              }}
            >
              {/* 상대방이 보낸 메시지일 때만 이름 표시 */}
              {!isMine && (
                <small style={{ display: "block", color: "#666", fontWeight: "bold" }}>
                  {msg.user.username}
                </small>
              )}
              
              {/* 말풍선 */}
              <span style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: isMine ? "#DCF8C6" : "#EAEAEA", // 내 글은 연두색, 남의 글은 회색
                color: "#000",
                maxWidth: "70%",
                wordBreak: "break-word"
              }}>
                {msg.text}
              </span>
            </div>
          )
        })}
        {/* 5. ⭐여기가 핵심! 메시지 목록 바로 밑에 빈 디브를 두고 가리킵니다. */}
        <div ref={messagesEndRef} />
      </div>
   
      {/* ✍️ 메시지 입력 영역 */}
      <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          전송
        </button>
      </form>
    </div>

    <div className="w-40 border-l p-4">
      <p className="text-sm font-medium mb-2">온라인 {onlineUsers.length}명</p>
      {onlineUsers.map((user, i) => (
        <div key={i} className="flex items-center gap-2 text-sm py-1">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          {user}
        </div>
      ))}
    </div>

    </div>
  )
}

export default Chat