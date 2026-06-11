import { useEffect, useRef, useState } from "react"
import { socket } from "./server/socket"

interface User {
  id: number
  username: string
  email: string
}

interface Message {
  id: number
  text: string
  userId: number
  createdAt: string
  user: User
}

function Chat({ userId, roomId }: { userId: number | null; roomId: number }) {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    socket.auth = { token }
    socket.connect()

    return () => {}
  }, [])

  useEffect(() => {
    socket.on("connect", () => {
      console.log("소켓 연결 성공! 서버에 유저 이름 알림")
    })

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users)
    })

    socket.on("previous_messages", (data: Message[]) => {
      setMessages(data)
    })

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data])
    })

    return () => {
      socket.off("connect")
      socket.off("online_users")
      socket.off("previous_messages")
      socket.off("receive_message")
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket.connected) return
    socket.emit("join_room", roomId)
    socket.emit("get_previous_messages", roomId)
    setMessages([])
  }, [roomId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    socket.emit("send_message", {
      text: message,
      roomId: roomId,
    })

    setMessage("")
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const currentUserId = userId || Number(localStorage.getItem("userId"))

  return (
    <div className="flex justify-center w-full px-4 py-6">
      <div className="w-full max-w-2xl text-left">
        <h2 className="text-center text-gray-900 dark:text-gray-100">{roomId}번 방</h2>

        <div className="mt-4 mb-4 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">
            온라인 {onlineUsers.length}명
          </p>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.length === 0 ? (
              <span className="text-xs text-gray-400 dark:text-gray-500">접속 중인 사용자가 없습니다</span>
            ) : (
              onlineUsers.map((user) => (
                <span
                  key={user}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
                  {user}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800">
          {messages.map((msg) => {
            const isMine = msg.userId === currentUserId

            return (
              <div
                key={msg.id || msg.createdAt}
                className={`my-2.5 ${isMine ? "text-right" : "text-left"}`}
              >
                {!isMine && (
                  <small className="block text-gray-500 dark:text-gray-400 font-semibold text-xs mb-0.5">
                    {msg.user.username}
                  </small>
                )}

                <span
                  className={[
                    "inline-block px-3 py-2 rounded-xl max-w-[70%] break-words text-sm",
                    isMine
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                  ].join(" ")}
                >
                  {msg.text}
                </span>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 h-10 px-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
          />
          <button
            type="submit"
            className="h-10 px-5 text-sm font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors cursor-pointer"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
