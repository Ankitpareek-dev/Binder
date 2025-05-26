const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from the test page for github");
});
app.use("/", (req, res) => {
  res.send("Hello from the dashboard!");
});

app.listen(3000, () => {});
