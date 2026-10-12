const express = require('express');
const jwt = require('jsonwebtoken');
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const SECRET = "expresspractice";
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.json())

// login
app.post('/login', (req, res) => {
    const { username } = req.body ?? {};
    if (!username) {
        return res.status(400).json({
            message: "No username given"
        })
    }
    const payload = { user: username };
    const token = jwt.sign(payload, SECRET);
    return res.status(200).json({
        success: true,
        message: "logged in",
        token: token
    })

});

// auth middleware
function auth(req, res, next) {
    const authtoken = req.headers.authorization;
    if (!authtoken) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    try {
        let check = authtoken;
        if (authtoken.startsWith("Bearer ")) {
            check = authtoken.slice(7);
        }
        req.user = jwt.verify(check, SECRET);
    }
    catch (err) {
        console.log(err.message);
        return res.status(401).json({
            message: err.message
        });
    }
    next();
}

// socket auth
io.use((socket, next) => {
    try {
        socket.user = jwt.verify(socket.handshake.auth.token, SECRET);
        next();
    } catch {
        next(new Error("unauthorized"));
    }
});

// connection and joining group
io.on("connection", (socket) => {
    socket.join(`user:${socket.user.user}`);
    socket.on("joinGroup", (groupId) => socket.join(`group:${groupId}`));
});


// profile
app.get('/me', auth, (req, res, next) => {
    return res.status(200).json({ user: req.user });
});

// add expense
app.post("/groups/:id/expenses", auth, (req, res) => {
    const expense = { ...req.body, by: req.user.user };
    io.to(`group:${req.params.id}`).emit("expenseAdded", expense);
    res.status(201).json(expense);
});
server.listen(3000, () => console.log("Running on port 3000"))