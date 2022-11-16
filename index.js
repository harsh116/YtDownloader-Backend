const PORT = process.env.PORT || 8081;
const express = require("express");
const cors = require("cors");

const { getList } = require("./getList");

const corsOptions = {
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.post("/getList", getList);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
