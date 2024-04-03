const express = require("express");
const { 
    createUser,
    loginUserCtrl,
    getallUser,
    getUser,
    deleteUser,
    updateUser,
 } = require("../controller/userCtrl");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
module.exports = router;