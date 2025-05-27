const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllUserData", (req, res, next) => {
  console.log(req);
  res.send("all user data accessed");
});

app.get("/user", userAuth, (req, res) => {
  console.log(req);
  res.send({ firstname: "Ankit", lastname: "Pareek" });
});
app.get("/test", (req, res) => {
  res.send("Hello from the test page for github");
});
app.get("/", (req, res) => {
  res.send("Hello from the home page");
});

app.get("/", (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send("something went wrong");
    return;
  }
});
app.listen(3000, () => {});
