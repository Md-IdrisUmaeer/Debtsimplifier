const jwt = require('jsonwebtoken');
const payload = { userId: 1, role: "member" };
const token = jwt.sign(payload, "jwtpractice", { expiresIn: "10s" });
const base64url = token.split('.')[1];
const load = (Buffer.from(base64url, "base64url").toString())
try {
    console.log(jwt.verify(token, "jwtpractice"));
}
catch (err) {
    console.log(err.message);
}

setTimeout(() => {
    try {
        jwt.verify(token, "jwtpractice");
    }
    catch (err) {
        console.log(err.message);
    }

}, 11000);

try {
    const [header, , signature] = token.split('.');
    const obj = JSON.parse(load);
    obj.role = "admin";
    const fakePayload = Buffer.from(JSON.stringify(obj)).toString("base64url");
    console.log(jwt.verify(`${header}.${fakePayload}.${signature}`, "jwtpractice"));
} catch (err) {
    console.log(err.name, err.message);
}
try {
    console.log(jwt.verify(token, "jwtprac tice"));
}
catch (err) {
    console.log(err.message);
}
