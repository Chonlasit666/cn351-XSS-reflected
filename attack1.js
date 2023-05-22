const express = require("express");
const cookieParser = require("cookie-parser");
const { createReadStream } = require("fs");
//const createReadStream = require("fs").createReadStream;
const bodyParser = require("body-parser");
const randomBytes = require("crypto").randomBytes;

const COOKIE_SECRET = "asdfw4twsdfasdf3q5yeasrgasdfasdfasdfasdfasdef";

const PORT = 5443;


const app = express();
app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {

    createReadStream(`attacker.html`).pipe(res);
});


app.get("/attacker-frame.html", (req, res) => {

    createReadStream(`attacker-frame.html`).pipe(res);
});


console.log(`Start server on ${PORT}`);
app.listen(PORT);
