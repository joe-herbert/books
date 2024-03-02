const express = require("express");
const path = require("path");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const secret = require(__dirname + "/config/secret.json").secret;
const app = express();
const port = 3000;
const router = require("./controllers/index.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore({
            checkPeriod: 86400000, //every 24h
        }),
    }),
);

app.use("/books/", router);

app.listen(port, () => {
    console.log(`books app listening on port ${port}`);
});
