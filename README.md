# backend-practice

Small, focused Node.js exercises where I rebuilt the backend pieces of [SettleUp](https://github.com/Md-IdrisUmaeer/Settle-Up) from a blank file: debt simplification, Jest tests, JWT auth and real-time updates with Socket.IO. Each folder is one exercise. The goal was to understand every line, not to ship a product.

## What's inside

| Folder / file | What it does | What I learned |
|---|---|---|
| `settle.js`, `settle.test.js` | Turns a group's expenses into net balances, then settles them with a greedy algorithm that matches the largest debtor with the largest creditor | Money is stored as integer paise to avoid floating-point drift. Greedy gives **at most n-1 payments**, but not always the true minimum (that problem is NP-hard). Sorting makes it O(n log n). |
| `JWT/jwt.js` | Signs a token, verifies it, then shows the three ways verification fails: a tampered payload, a wrong secret and an expired token | The payload is only base64url-encoded, not encrypted, so anyone can read it. The signature is what stops edits. |
| `Express_app/` | Express server with `POST /login`, a Bearer-token `auth` middleware and a protected `GET /me` | How middleware attaches `req.user`, and why a 401 is returned before the route runs |
| `socket/` | Socket.IO basics: `emit`, `on` and `broadcast` | The difference between `io.emit` (everyone), `socket.broadcast.emit` (everyone except me) and `socket.emit` (just me) |
| `socket2/` | Rooms: clients join `group:<id>` and only that group gets its messages | `io.to(room)` vs `socket.to(room)`, and that rooms are left automatically on disconnect |
| `realtime/` | Combines the two: JWT-checked socket handshake, a personal `user:<id>` room, and an Express route that saves an expense and then announces it to the group room | Why the **route** emits after the write instead of the client emitting directly: the data is validated and stored, offline users can fetch it later, and plain REST clients still trigger updates |

## Running it

```bash
npm install
npm test                       # Jest tests for the debt simplifier
node JWT/jwt.js                # sign / verify / tamper / expiry demo (waits ~11s for expiry)
```

Real-time demo:

```bash
node realtime/server.js        # starts on http://localhost:3000

# 1. get a token
curl -X POST localhost:3000/login -H "Content-Type: application/json" -d '{"username":"idris"}'

# 2. in another terminal, connect a client that joins group g1
node realtime/client.js B <token>

# 3. add an expense; client B prints it
curl -X POST localhost:3000/groups/g1/expenses \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"amount":100}'
```

A client started with a bad token prints `rejected: unauthorized`.

## Known shortcuts

These are practice servers, so a few things are deliberately simplified:

- The JWT secret is hard-coded. A real app reads it from an environment variable.
- `/login` accepts any username without a password. SettleUp uses bcrypt for that.
- Expenses aren't saved to a database, so the route only announces them.
- Tokens can't be revoked individually. A real app would use short expiry plus refresh tokens, or a denylist.

## Tech

Node.js, Express 5, jsonwebtoken, Socket.IO 4, Jest
