const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send({ message: "Session not found" });
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    req.decode = decode;
    next();
  } catch (error) {
    res
      .clearCookie("authToken")
      .status(401)
      .send({ error: error, message: "error: invalid cookie" });
    return;
  }
};
