var express = require("express");
var router = express.Router();
const fs = require('fs');




router.get("/", async (req, res, next) => {
  res.render("index");
});

router.get("/geojson", async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  fs.createReadStream('./public/map.geojson').pipe(res);
  
})

module.exports = router;
