var express = require("express");
var router = express.Router();
const readFromXlsx = require("../utils/readFromXlsx");
/* GET home page. */
router.get("/", async (req, res, next) => {
  const data = await readFromXlsx();
  res.render("index");
});

router.get("/data", async (req, res, next) => {
  const data = await readFromXlsx();
  res.json(data);
});

module.exports = router;
