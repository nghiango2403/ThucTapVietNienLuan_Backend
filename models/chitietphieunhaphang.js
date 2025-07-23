const mongoose = require("mongoose");

const ChiTietPhieuNhapHangSchema = mongoose.Schema({
  MaPhieuNhapHang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhieuNhapHang",
    require: true,
  },
  MaHangHoa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HangHoa",
    require: true,
  },
  SoLuong: { type: Number, require: true },
  TienHang: { type: Number, require: true },
});

module.exports = mongoose.model(
  "ChiTietPhieuNhapHang",
  ChiTietPhieuNhapHangSchema
);
