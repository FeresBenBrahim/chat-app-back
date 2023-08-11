const express = require ("express");
const router = express.Router();

const authRoutes = require("./auth.js");
const messages = require("./messages.js");
const users = require('./user.js');
const conversations = require('./conversations.js')

router.use("/",authRoutes);
router.use("/messages",messages);
router.use('/users',users)
router.use('/conversations',conversations)

module.exports = router;
