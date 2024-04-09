const express = require("express");
const { 
    createUser,
    loginUserCtrl,
    getallUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
 } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/auhtMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;