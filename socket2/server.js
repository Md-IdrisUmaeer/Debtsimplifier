const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// server setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// connection
io.on("connection", (socket) => {
    console.log("connected", socket.id);

    // message
    socket.on("message", (data) => {
        socket.broadcast.emit("reply", `server got: ${data}`);
    });

    // joining group
    socket.on("joinGroup", (groupId) => {
        socket.join(`group:${groupId}`);
    });

    // new expense
    socket.on("newExpense", ({ groupId, expense }) => {
        socket.to(`group:${groupId}`).emit("expenseAdded", expense);
    });

    // disconnect
    socket.on("disconnect", () => console.log("left", socket.id));
});

server.listen(3000);