const mongoose = require("mongoose");

const PhieuNhapHangSchema = mongoose.Schema({
  ThoiGianNhap: { type: String, require: true },
});

module.exports = mongoose.model("PhieuNhapHang", PhieuNhapHangSchema);
