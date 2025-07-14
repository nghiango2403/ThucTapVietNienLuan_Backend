const mongoose = require("mongoose");

const HoangHoaSchema = mongoose.Schema({
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

module.exports = mongoose.model("HangHoa", HoangHoaSchema);
