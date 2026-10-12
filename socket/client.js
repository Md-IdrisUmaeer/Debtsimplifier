const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

// send and receive
socket.on("connect", () => socket.emit("message", "hi from client"));
socket.on("reply", (msg) => console.log(msg));