const express = require("express");
const cookieParser = require("cookie-parser");
const { createReadStream } = require("fs");
//const createReadStream = require("fs").createReadStream;
const bodyParser = require("body-parser");
const randomBytes = require("crypto").randomBytes;

const COOKIE_SECRET = "asdfw4twsdfasdf3q5yeasrgasdfasdfasdfasdfasdef";

const PORT = 5000;
const USERS = { alice: "1234", bob: "1234" };
const BALANCES = { alice: 500, bob: 1000 };

const SESSIONS = {}; // map sessionId -> username

const app = express();
app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const { sessionId } = req.cookies
  const username = SESSIONS[sessionId]
  if (username) {
  res.send(`
  <h1>Welcome, ${username}</h1>
  <p>Your balance is $${BALANCES[username]}</p>
  <p><a href='/logout'>Logout</a></p>
  <form method='POST' action='/transfer'>
  Send amount:
  <input name='amount' />
  To user:
  <input name='to' />
  <input type='submit' value='Send' />
  </form>
  `)
  } else {
  createReadStream('index.html').pipe(res)
  }
 })

 app.post('/transfer', (req, res) => {
  const { sessionId } = req.cookies
  const username = SESSIONS[sessionId]
  if (!username) {
  res.send('Only logged in users can transfer money')
  return
  }
  const amount = Number(req.body.amount)
  const to = req.body.to
  BALANCES[username] -= amount
  BALANCES[to] += amount
  res.redirect('/')
 })

app.get("/login", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const username = SESSIONS[sessionId];
  if (username) {
    res.send(`Hi ${username}`);
  } else {
    createReadStream(`index.html`).pipe(res);
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = USERS[username];
  if (password === req.body.password) {
    const nextSessionId = randomBytes(16).toString("base64");
    res.cookie("sessionId", nextSessionId, {
      secure: true
    }) ;
    SESSIONS[nextSessionId] = username;
    res.redirect("/");
  } else {
    res.send("Fail!");
  }
});

app.get("/logout", (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete SESSIONS[sessionId];
  res.clearCookie("sessionId");

  res.redirect("/");
});

console.log(`Start server on ${PORT}`);
app.listen(PORT);
