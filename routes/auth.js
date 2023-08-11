const authController = require("../controllers/authController.js");
// const { schemaValidator } = require("../../middlewares/schemaValidator");
const {
  signup,
  login,
  updatePassword,
  updateMe,
} = require("./schemas/auth");
const express = require("express");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User managing API
 */

router.post("/register", authController.signUp);
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The list of the register
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *
 */
router.post("/login",authController.login);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/LoginSchema'
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/LoginSchema'
 *
 */
router.route("/me").get(authController.getMe);
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get me
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Get me
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */
router
  .route("/updateMyPassword")
  .put(
    authController.protect,
    authController.updatePassword
  );
/**
 * @swagger
 * /updateMyPassword:
 *   put:
 *     summary: Password update
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/Password'
 *     responses:
 *       200:
 *         description: Password update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Password'
 *     security:
 *      - bearerAuth: []
 */
router
  .route("/updateMe")
  .put(
    authController.protect,
    authController.updateMe
  );
/**
 * @swagger
 * /updateMe:
 *   put:
 *     summary: Update user's profile
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Update user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */
module.exports = router;
