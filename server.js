require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");
const initApiRoutes = require("./routes/apiroutes");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({ credentials: true, origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  } }));

app.use(express.json());
app.use(express.urlencoded({}));
initApiRoutes(app);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server đang chạy tại port: ", PORT);
  });
});
