const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json())

app.post('/login', (req, res) => {
    const { username } = req.body ?? {};
    if (!username) {
        return res.status(400).json({
            message: "No username given"
        })
    }
    const payload = { user: username };
    const token = jwt.sign(payload, 'expresspractice');
    return res.status(200).json({
        success: true,
        message: "logged in",
        token: token
    })

});

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
        req.user = jwt.verify(check, 'expresspractice');
    }
    catch (err) {
        console.log(err.message);
        return res.status(401).json({
            message: err.message
        });
    }
    next();
}
app.get('/me', auth, (req, res, next) => {
    return res.status(200).json({ user: req.user });
});
app.listen(3000, () => console.log("Running on port 3000"))