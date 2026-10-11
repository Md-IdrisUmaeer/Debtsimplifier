const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // Socket.IO attaches to this
const io = new Server(server);

io.on("connection", (socket) => {      // runs once per connected client
    console.log("connected", socket.id);

    socket.on("message", (data) => {        // listen for an event from this client
        socket.broadcast.emit("reply", `server got: ${data}`); // send back to this client only
    });

    socket.on("joinGroup", (groupId) => {   // NEW: lesson 2
        socket.join(`group:${groupId}`);
    });

    socket.on("newExpense", ({ groupId, expense }) => {   // NEW
        socket.to(`group:${groupId}`).emit("expenseAdded", expense);
    });

    socket.on("disconnect", () => console.log("left", socket.id));
});

server.listen(3000); // note: server.listen, not app.listen