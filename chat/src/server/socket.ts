import { io } from "socket.io-client"

// 🌐 현재 환경이 배포(production)인지 개발(development)인지 컴퓨터가 알아서 판단합니다.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"              // 👈 2. 지금 내 컴퓨터에서 테스트할 때는 알아서 일로 연결됩니다.

// 🔒 가방만 세팅해두고, "내가 명령 내리기 전까진 절대 먼저 출발하지 마!" 라고 묶어두는 겁니다.
export const socket = io(BACKEND_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token") // 👈 로그인 토큰도 배포 환경에 맞춰 같이 넘어가도록 복구!
  },
})