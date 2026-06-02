import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import pkg from './src/generated/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

dotenv.config()

const { PrismaClient } = pkg;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
})

app.use(cors())
app.use(express.json())

app.post("/register", async(req, res)=>{
  const {username , email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱


  const user = await prisma.user.create({
    data: {username, email, password: hashedPassword}
  })

  res.json(user)
})

app.post('/login', async(req, res)=>{
  const {email, password} = req.body;

  const user = await prisma.user.findUnique({
    where : {email}
  })

  if(!user) return res.status(404).json({error: "아이디가 존재하지 않습니다"})

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if(!isPasswordValid) return res.status(401).json({error: "비밀번호가 일치하지 않습니다"})

  const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: "7d" })
  res.json({token, user})
})

// 🔌 [Socket.io Middleware] 연결 시 JWT 토큰 검증하기
io.use((socket, next) => {
  const token = socket.handshake.auth.token // 프론트엔드에서 연결할 때 보낸 토큰

  if (!token) {
    return next(new Error("인증 에러: 토큰이 제공되지 않았습니다."))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.userId // 소켓 객체에 유저 ID를 심어두기! -메시지 저장할때 userId로 활용할 예정-  
    next()
  } catch (err) {
    return next(new Error("인증 에러: 유효하지 않은 토큰입니다."))
  }
})

const onlineUsers = new Map()  // socketId → username

io.on("connection", async (socket) => {
  console.log("user connected")

 try {
    const previousMessages = await prisma.message.findMany({
      orderBy: { createdAt : "asc"},
      include:{
        user: true 
      }
    })
    // 데이터베이스 조회가 성공했을 때만 프론트엔드로 안전하게 보냅니다.
    socket.emit("previous_messages", previousMessages)
  } catch (error) {
    // 🚨 DB 연결 실패 시 Render 로그에 원인을 이쁘게 찍고 서버는 계속 살려둡니다.
    console.error("❌ [Prisma DB 조회 실패! Render의 Environment 탭에 DATABASE_URL을 확인하세요]:", error.message)
    // 에러가 나면 프론트엔드에 빈 배열이라도 던져줘서 프론트가 뻗는 걸 방지합니다.
    socket.emit("previous_messages", [])
  }
  
  socket.on("user_join", (username) => {
    onlineUsers.set(socket.id, username)
    io.emit("online_users", Array.from(onlineUsers.values()))
  })


  socket.on("send_message", async (data) => {
    try{
    // 🎯 [여기가 핵심!] 메시지가 날아오면 공중에 뿌리기 전에 DB에 영구 저장하기!
    const newMessage = await prisma.message.create({
      data: {
        text: data.text,
        // userId: data.userId // 아까 배운 관계 설정 고리!
        userId: socket.userId // 소켓 연결 시 검증된 유저 ID를 사용해서 메시지 저장하기!
      },
      include:{
        user: true // 새로 저장된 메시지에도 작성자 정보 포함해서 반환받기!
      }
    })

    io.emit("receive_message", newMessage)

}catch(error){
        console.error("Error saving message to database:", error)
    }

  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
    onlineUsers.delete(socket.id)
    io.emit("online_users", Array.from(onlineUsers.values()))
  })
})

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log("server running")
})