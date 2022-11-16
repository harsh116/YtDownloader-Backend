const PORT = process.env.PORT || 8081;
const express = require("express");
const cors = require("cors");

const { getList } = require("./getList");

const corsOptions = {
  credentials: true,
};

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
});
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static("public"));

app.post("/getList", getList);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
