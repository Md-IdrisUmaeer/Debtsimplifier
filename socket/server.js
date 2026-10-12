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

    // disconnect
    socket.on("disconnect", () => console.log("left", socket.id));
});

server.listen(3000);