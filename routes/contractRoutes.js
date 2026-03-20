const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");

router.post("/", contractController.createContract);
router.put("/end/:id", contractController.endContract);
module.exports = router;