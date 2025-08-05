const mongoose = require("mongoose");

const ThanhToanSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  MaHoaDon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HoaDon",
    required: true,
  },
  ThoiGianThanhToan: { type: Date, default: null },
  ThoiGianTao: {
    type: Date,
    default: Date.now,
  },
  TrangThaiThanhToan: {
    type: String,
    default: "Chưa thanh toán",
  },
});

module.exports = mongoose.model("ThanhToan", ThanhToanSchema);
