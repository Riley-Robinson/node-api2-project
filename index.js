const express = require("express");
const postRouter = require("./router");
const server = express();

server.get("/", (req, res) => {
    res.json({ api: "Project api is up" });
});

server.use(express.json());
server.use("/api/posts", postRouter);

server.listen(8000, () => console.log("server is up on 8k"))