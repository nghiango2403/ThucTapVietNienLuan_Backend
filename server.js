const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");
const initApiRoutes = require("./routes/apiroutes");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({}));
initApiRoutes(app);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server đang chạy tại port: ", PORT);
  });
});
