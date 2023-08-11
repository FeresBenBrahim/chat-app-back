const express = require("express");
const router = express.Router();
const { getAll } = require("../controllers/userController.js")
const authController = require('../controllers/authController.js')
router.get(
    "/",
    authController.protect,
    getAll
);

module.exports = router;
