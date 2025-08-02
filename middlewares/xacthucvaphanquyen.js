const jwt = require("../utils/jwt");
const XacThuc = (req, res, next) => {
  whiteList = [
    "/dangnhap",
    "/xulythanhtoanmomo",
    "/xulythanhtoanvnpay",
    "/xulythanhtoanzalopay",
    "/test",
  ];
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
module.exports = { XacThuc };
