const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8081;
const express = require("express");
const cors = require("cors");
const ms = require("ms");
const responseState = require("./states/responseState");
const { sendMedia } = require("./helpers/sendMedia");

function setConnectionTimeout(time) {
  var delay = typeof time === "string" ? ms(time) : Number(time || 5000);

  return function (req, res, next) {
    res.connection.setTimeout(delay);
    next();
  };
}

const { getList } = require("./main/getList");
const { getIndividualList } = require("./main/getIndividualList");
const { redisClient } = require("./states/redis");
const corsOptions = {
  credentials: true,
};

const app = express();
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   // another common pattern
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,OPTIONS,PATCH,DELETE,POST,PUT"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//   );
// });
app.use(express.json());
app.use(express.static(__dirname + "/build"));
app.use(cors(corsOptions));
// app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.status(200).json("ok");
});

app.post("/getList", setConnectionTimeout("12h"), getList);
app.post("/getIndividualList", setConnectionTimeout("12h"), getIndividualList);
app.get("/getResponseState", (req, res) => {
  console.log(responseState);
  res.json({ state: responseState.currentState, data: responseState.data });
  // res.send()
});
app.post("/sendMedia", sendMedia);

const server = app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
  // redisClient.flushDb(function (err, succeeded) {
  //   console.log(succeeded); // will be true if successfull
  // });
  // redisClient.FLUSHALL("sync"); //("ASYNC", function (err, succeeded)
  // {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(succeeded); // will be true if successfull
  // });
});
