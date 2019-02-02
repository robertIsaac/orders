import express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
    res.status(403).send('Forbidden');
});

router.get("/post/:postId/comment/:commentId", (req, res) => {
    res.send(`post id is ${req.params.postId} and comment id is ${req.params.commentId}`);
});

export = router;
