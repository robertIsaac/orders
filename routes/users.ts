import express = require("express");

const router = express.Router();

/* GET users listing. */
export default router.get("/", (req, res) => {
  res.send("respond with a resource");
});
