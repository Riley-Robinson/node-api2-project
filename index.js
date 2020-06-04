const express = require("express");
const server = express();
const postsRouter = require("./router");


server.get("/", (req, res) => {
    res.json({ api: "Project api is up" });
});

server.use(express.json());
server.use("/api/posts", postsRouter);

server.listen(8000, () => console.log("server is up on 8k"));