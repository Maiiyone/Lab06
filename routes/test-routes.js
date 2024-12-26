const express = require("express");
const { verifyToken, verifyAdmin } = require("../Controllers/auth-controller");
const router = express.Router();/**
* @swagger
* /api/admin:
*   get:
*     summary: Verify admin
*     description: Validate the provided Bearer Token to ensure it is valid and not expired.
*     tags: [Test]
*     security:
*       - bearerAuth: [] # Sử dụng Bearer Token Authentication
*     responses:
*       200:
*         description: admin verified successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Verified admin successfully
*                 data:
*                   type: object
*                   properties:
*                     id:
*                       type: integer
*                       example: 1
*                     username:
*                       type: string
*                       example: johndoe
*                     role:
*                       type: string
*                       example: user
*       401:
*         description: Unauthorized (Invalid or expired token)
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Invalid or expired token
*                 error:
*                   type: string
*                   example: Token is not valid
*       500:
*         description: Internal server error
*/


router.get("/", verifyAdmin, (req, res) => {
  res.status(200).json({
    message: "Verified admin successfully",
    data: req?.user,
  });
});

module.exports = router;
