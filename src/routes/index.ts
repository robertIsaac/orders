import express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
    res.status(404).send('404, NOT FOUND');
});

export = router;
