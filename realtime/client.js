const { io } = require("socket.io-client");
const token = process.argv[3];
const socket = io("http://localhost:3000", { auth: { token } });
const name = process.argv[2];

// events
socket.on("connect_error", (err) => console.log("rejected:", err.message));
socket.on("expenseAdded", (exp) => console.log(name, "got", exp));
socket.on("connect", () => socket.emit("joinGroup", "g1"));