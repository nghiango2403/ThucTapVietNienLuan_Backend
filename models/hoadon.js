const mongoose = require("mongoose");

const HoaDonSchema = mongoose.Schema({
  MaNhanVien: { type: mongoose.Schema.Types.ObjectId, ref: "NhanSu" },
  NgayLap: { type: Date, default: new Date() },
  MaKhuyenMai: { type: mongoose.Schema.Types.ObjectId, ref: "KhuyenMai" },
  HinhThucThanhToan: {
    type: String,
    require: true,
    enum: ["Trực tiếp", "MoMo", "ZaloPay", "VnPay"],
  },
});

module.exports = mongoose.model("HoaDon", HoaDonSchema);
