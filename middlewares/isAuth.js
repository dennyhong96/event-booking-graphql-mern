const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  if (!decoded) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decoded.userId;
  next();
};
