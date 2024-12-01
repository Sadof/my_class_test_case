const express = require("express");
const app = express();

var apiRouter = require("./routes/api");

app.use("/api", apiRouter);

app.listen(4200);
