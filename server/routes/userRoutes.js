const express = require("express");
const UserController = { getUsers: function () {} };

const router = express.Router();

const { getUsers, verifyMailAddress, createUser, loginUser } = UserController;

router.get("/", getUsers);

module.exports = router;
