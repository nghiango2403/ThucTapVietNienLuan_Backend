const mongoose = require("mongoose");

const PhieuNhapHangSchema = mongoose.Schema({
  ThoiGianNhap: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PhieuNhapHang", PhieuNhapHangSchema);
