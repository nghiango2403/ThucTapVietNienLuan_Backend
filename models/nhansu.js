const mongoose = require("mongoose");

const NhanSuSchema = new mongoose.Schema({
  HoTen: { type: String, required: true },
  SDT: { type: String, required: true },
  Email: { type: String, required: true },
  NgaySinh: { type: Date },
  DiaChi: { type: String, required: true },
  GioiTinh: { type: String, required: true },
});

module.exports = mongoose.model("NhanSu", NhanSuSchema);
