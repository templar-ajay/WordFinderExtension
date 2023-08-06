const express = require("express");
const UserController = require("../controllers/userController.js");

const router = express.Router();

const { getUsers, verifyMailAddress, createUser, loginUser } = UserController;

router.get("/", getUsers);
router.post("/login", loginUser);

module.exports = router;
