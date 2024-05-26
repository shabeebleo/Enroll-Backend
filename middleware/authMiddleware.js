const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  console.log("auth ethi");
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  console.log(token, "tokennn");
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log("token verification ");
    if (err) return res.sendStatus(401);
    console.log(user, "in auth middlware");
    req.user = user.user;
    next();
  });
}

module.exports = authenticateToken;
