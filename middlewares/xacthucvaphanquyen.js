const {
  LayQuyenCuaChucVu,
  LayThongTinBangTenDangNhap,
} = require("../services/mainservice");
const jwt = require("../utils/jwt");
whiteList = [
  "/dangnhap",
  "/xulythanhtoanmomo",
  "/xulythanhtoanvnpay",
  "/xulythanhtoanzalopay",
  "/lammoiaccesstoken",
  "/test",
];
const XacThuc = (req, res, next) => {
  if (whiteList.some((path) => req.path.includes(path))) {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token hợp lệ" });
  }
  let token = req.headers.authorization.split(" ")[1];
  let decode = jwt.XacThucToken(token, process.env.ACCESS_TOKEN_SECRET);
  if (decode) {
    req.user = {
      MaChucVu: decode.MaChucVu,
      MaNhanSu: decode.MaNhanSu,
      MaNhanVien: decode.MaNhanVien,
    };
    next();
  } else {
    res.status(401).json({
      status: 401,
      message: "Not authenticated",
    });
  }
};
const KiemTraTaiKhoanCoBiKhoa = async (req, res, next) => {
  try {
    const result = await LayThongTinBangTenDangNhap(req.body.TenDangNhap);
    if (result.data.KichHoat === false) {
      return res.status(403).json({
        status: 403,
        message: "Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản lý",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Lỗi khi kiểm tra tài khoản",
    });
  }
};
const PhanQuyen = async (req, res, next) => {
  if (whiteList.some((path) => req.path.includes(path))) {
    return next();
  }
  const laydsquyen = await LayQuyenCuaChucVu(req.user);
  if (laydsquyen.status != 200) {
    return res.status(laydsquyen.status).json(laydsquyen);
  }
  const dsQuyen = laydsquyen.data.map((q) => q.MaQuyen.Url);
  if (!dsQuyen.some((path) => req.path.includes(path))) {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  next();
};
module.exports = { XacThuc, KiemTraTaiKhoanCoBiKhoa, PhanQuyen };
