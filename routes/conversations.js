const express = require("express");
const router = express.Router();
const { getAll , getOneWithUser } = require("../controllers/conversationController.js")
const authController = require('../controllers/authController.js')
router.get(
    "/",
    authController.protect,
    getAll
);

router.get('/with/:id',authController.protect,getOneWithUser)



module.exports = router;