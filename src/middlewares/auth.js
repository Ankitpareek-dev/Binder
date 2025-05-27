const adminAuth = (req, res, next) => {
  const token = "xyz";
  const validToken = token === "xyz";
  if (validToken) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const validToken = token === "xyz";
  if (validToken) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
// This code defines two middleware functions for authentication in an Express.js application.
