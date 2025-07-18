const mongoose = require("mongoose");

const ThanhToanSchema = mongoose.Schema({
  MaHoaDon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HoaDon",
    required: true,
  },
  MaGiaoDich: {
    type: String,
    default: null,
  },
  ThoiGianThanhToan: { type: Date, default: null },
  TrangThaiThanhToan: {
    type: String,
  },
});

module.exports = mongoose.model("ThanhToan", ThanhToanSchema);
