const mongoose = require("mongoose");

const TaoKhoanSchema = new mongoose.Schema({
  TenDangNhap: { type: String, required: true },
  MatKhau: { type: String, required: true },
  MaNhanSu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NhanSu",
    required: true,
  },
  MaChucVu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChucVu",
    required: true,
  },
  KichHoat: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("TaiKhoan", TaoKhoanSchema);
