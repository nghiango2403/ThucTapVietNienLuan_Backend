const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");
const initApiRoutes = require("./routes/apiroutes");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2],
  })
);

app.use(express.json());
app.use(express.urlencoded({}));
initApiRoutes(app);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server đang chạy tại port: ", PORT);
  });
});
