const express = require("express");
const UserController = require("../controllers/userController.js");

const router = express.Router();

const { getUsers, verifyOtp, createUser, loginUser } = UserController;

router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", loginUser);
router.post("/verifyOtp", verifyOtp);

module.exports = router;
