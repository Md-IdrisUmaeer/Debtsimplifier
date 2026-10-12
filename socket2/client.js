const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");
const name = process.argv[2];
const group = process.argv[3];


// message
socket.on("connect", () => socket.emit("message", "hi from client"));
socket.on("reply", (msg) => console.log(msg));

// joining group and sending expense
socket.on("connect", () => {
    socket.emit("joinGroup", group);
    if (name === "A") {
        socket.emit("newExpense", { groupId: group, expense: { by: "A", amount: 100 } });
    }
});

// receiving expense
socket.on("expenseAdded", (exp) => console.log(name, "got", exp));