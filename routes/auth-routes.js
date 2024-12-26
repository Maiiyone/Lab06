const express = require("express");
const { RegisterUser, LoginUser } = require("../Controllers/auth-controller");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user
 *                 example: maiiyone
 *               password:
 *                 type: string
 *                 description: The password for the new user
 *                 example: maiiyone
 *               role:
 *                 type: string
 *                 description: The role of the new user
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/register", RegisterUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: maiiyone
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: maiiyone
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.post("/login", LoginUser);

module.exports = router;
