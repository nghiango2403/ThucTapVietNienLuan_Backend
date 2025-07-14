const mongoose = require("mongoose");

const HoangHoaSchema = mongoose.Schema({
  ThoiGianLap: { type: datetime, require: true },
  MaKhuyenMai: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KhuyenMai",
    require: true,
  },
  HinhThucThanhToan: {
    type: String,
    require: true,
    enum: ["Trực tiếp", "MoMo", "ZaloPay", "VnPay"],
  },
  MaTaiKhoan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaiKhoan",
    require: true,
  },
});

module.exports = mongoose.model("HangHoa", HoangHoaSchema);
