const mongoose = require("mongoose");

const KhuyenMaiSchema = mongoose.Schema({
  TenKhuyenMai: { type: String, require: true },
  NgayBatDau: { type: Date, require: true },
  NgayKetThuc: { type: Date, require: true },
  TienKhuyenMai: { type: Number, require: true },
  DieuKien: { type: Number, require: true },
});

module.exports = mongoose.model("KhuyenMai", KhuyenMaiSchema);
