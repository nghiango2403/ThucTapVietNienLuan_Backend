const mongoose = require("mongoose");

const ChiTietHoaDonSchema = new mongoose.Schema({
  MaHoaDon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HoaDon",
    required: true,
  },
  MaHangHoa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HangHoa",
    required: true,
  },
  SoLuong: { type: Number, required: true },
  DonGia: { type: Number, required: true },
});

module.exports = mongoose.model("ChiTietHoaDon", ChiTietHoaDonSchema);
