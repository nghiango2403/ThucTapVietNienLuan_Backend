const mongoose = require("mongoose");

const ChucVuSchema = new mongoose.Schema({
  TenChucVu: { type: String, required: true },
});

module.exports = mongoose.model("ChucVu", ChucVuSchema);
