const express = require("express");
const path = require("path");

const basePath = "";
const app = express();

app.use(basePath + "/", express.static(path.resolve(__dirname + "/build")));

app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname + "/build/index.html"));
});

const PORT = process.env.PORT || 9081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
