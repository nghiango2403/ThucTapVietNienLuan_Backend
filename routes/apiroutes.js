const express = require("express");
const router = express.Router();

const apiController = require("../controllers/maincontroller");
const middleware = require("../middlewares/xacthucvaphanquyen");

const initApiRoutes = (app) => {
  router.post("/dangnhap", apiController.dangnhap);
  router.post("/sulythanhtoanmomo", apiController.sulythanhtoanmomo);
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
  router.post("/themhanghoa", apiController.themhanghoa);
  router.get("/timhanghoa", apiController.timhanghoa);
  router.put("/capnhathanghoa", apiController.capnhathanghoa);
  router.post("/taophieunhaphang", apiController.taophieunhaphang);
  router.get("/layphieunhaphang", apiController.layphieunhaphang);
  router.get("/laychitietphieunhaphang", apiController.laychitietphieunhaphang);
  router.delete("/xoaphieunhaphang", apiController.xoaphieunhaphang);
  router.post("/themkhuyenmai", apiController.themkhuyenmai);
  router.put("/capnhatkhuyenmai", apiController.capnhatkhuyenmai);
  router.get("/laykhuyenmai", apiController.xemkhuyenmai);
  router.get("/laykhuyenmaiconhoatdong", apiController.xemkhuyenmaiconhoatdong);
  router.post("/themhoadon", apiController.themhoadon);
  router.get("/xemdanhsachhoadon", apiController.xemdanhsachhoadon);
  router.get(
    "/xemdanhsachhoadoncuanhanvien",
    apiController.xemdanhsachhoadoncuanhanvien
  );
  router.get("/xemchitiethoadon", apiController.xemchitiethoadon);
  router.delete("/xoahoadon", apiController.xoahoadon);
  router.post("/taothanhtoanmomo", apiController.taothanhtoanmomo);

  return app.use("/", router);
};
module.exports = initApiRoutes;
