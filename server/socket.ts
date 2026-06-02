// import { io } from "socket.io-client"

// const token = localStorage.getItem("token"); // 저장된 JWT 토큰

// export const socket = io("http://localhost:3000",{
//     auth:{
//         token: token // 서버로 연결할 때 JWT 토큰을 함께 보냅니다.
//     }
// })


import { io } from "socket.io-client"

// 🔒 가방만 세팅해두고, "내가 명령 내리기 전까진 절대 먼저 출발하지 마!" 라고 묶어두는 겁니다.
export const socket = io("http://localhost:3000", {
  autoConnect: false 
})