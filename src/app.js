const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  console.log(req);
  res.send({ firstname: "Ankit", lastname: "Pareek" });
});
app.use("/test", (req, res) => {
  res.send("Hello from the test page for github");
});

app.listen(3000, () => {});
