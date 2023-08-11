const express = require("express");
const router = express.Router();
const {getAll,createMsg,deleteMsg,update} = require("../controllers/messageController.js")
const authController = require('../controllers/authController.js')
router.get(
    "/:convID/",
    authController.protect,
    getAll
);


router.post(
    "/",
    authController.protect,
    createMsg
);

router.delete(
    "/:id",
    authController.protect,
    deleteMsg
);

router.put(
    "/:id",
    authController.protect,
    update
);

module.exports = router;