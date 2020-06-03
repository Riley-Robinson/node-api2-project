const express = require("express");
const router = express.Router();
//  this class ^ creates modular, mountable route handlers

const db = require("./data/db");

//get
router.route("/").get(async (req, res) => {
    try {
        const allPosts = await db.find();
        res.status(200).json(allPosts);
    } catch (err) {
        res.status(400).json(err);
    }
});

// get comments
router
    .get("/:id/comments", (req, res) => {
        db.findPostComments(req.params.id)
            .then((item) => {
                if (item) {
                    res.status(200).json(item);
                } else {
                    res.status(404).json({
                        errorMessage: "404 comment not found"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    errorMessage: "500 server is confused"
                });
            });
    })
    //posting
    .post("/", (req, res) => {
        !req.body.title || !req.body.contents
            ? res.status(400).json("400 this request is bad")
            : db
                .insert(req.body)
                .then((post) => {
                    db.findById(post.id).then((updated) =>
                        res.status(201).json(updated)
                    );
                })
                .catch((err) =>
                    res
                        .status(500)
                        .json("server error while posting")
                );
    });

// delete
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then((deleted) => {
            if (deleted) {
                res.status(200).json({ message: `Deleted.` });
            } else {
                res
                    .status(404)
                    .json({ message: `Post does not exist` });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: `the post cannot be deleted` });
        });
});

//shall we put things here WE SHALL
router.put("/:id", (req, res) => {
    const post = req.body;
    const id = req.params.id;

    if (!post.title || !post.contents) {
        res.status(400).json({
            errorMessage: "400 please add approperate contents"
        });
    } else {
        db.update(id, post)
            .then((item) => {
                if (item) {
                    res.status(200).json(post);
                } else {
                    res.status(404).json({
                        errorMessage: "404 this post does not exist"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    errorMessage: "500 the post could not be changed"
                });
            });
    }
});

//post comment
router.post("/:id/comments", (req, res) => {
    const comments = req.body;
    if (!comments.text) {
        res
            .status(400)
            .json({ errorMessage: " Please add text for your comment" });
    } else {
        db.insertComment(comments)
            .then((item) => {
                if (item) {
                    res.status(201).json(item);
                } else {
                    res.status(404).json({
                        errorMessage: "404 this comment does not exist"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    errorMessage: "500 server error"
                });
            });
    }
});

module.exports = router;