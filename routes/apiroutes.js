const express = require("express");
const router = express.Router();

const apiController = require("../controllers/maincontroller");
const middleware = require("../middlewares/xacthucvaphanquyen");

const initApiRoutes = (app) => {
  router.post("/dangnhap", apiController.dangnhap);
  router.use(middleware.XacThuc);
  router.post("/themchucvu", apiController.themchucvu);
  router.get("/laychucvu", apiController.xemchucvu);
  router.delete("/xoachucvu/", apiController.xoachucvu);
  router.post("/themnhanvien", apiController.themnhanvienvataikhoan);
  router.post("/doimatkhau", apiController.doimatkhau);
  router.get("/laythongtintaikhoan", apiController.laythongtintaikhoan);
  router.put("/doithongtintaikhoan", apiController.doithongtintaikhoan);
  router.get("/timnhanvien", apiController.timnhanvien);
  router.get("/laydanhsachnhanvien", apiController.xemdanhsachnhanvien);
  router.get(
    "/laythongtinchitietcuanhanvien",
    apiController.xemthongtinchitietcuanhanvien
  );
  router.put("/doithongtinnhanvien", apiController.doithongtinnhanvien);
  router.put("/doimatkhaunhanvien", apiController.doimatkhaunhanvien);
  router.put("/doichucvu", apiController.doichucvu);
  router.put("/mohoackhoataikhoan", apiController.mohoackhoataikhoan);

  return app.use("/", router);
};
module.exports = initApiRoutes;
