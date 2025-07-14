const express = require("express");
const router = express.Router();

const apiController = require("../controllers/maincontroller");

const initApiRoutes = (app) => {
  router.post("/themchucvu", apiController.themchucvu);
  router.get("/laychucvu", apiController.xemchucvu);
  router.delete("/xoachucvu/", apiController.xoachucvu);

  return app.use("/", router);
};
module.exports = initApiRoutes;
