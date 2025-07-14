const mongoose = require("mongoose");

const QuyenCuaChucVuSchema = new mongoose.Schema({
  ChucVu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChucVu",
    required: true,
  },
  Quyen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quyen",
    required: true,
  },
});

module.exports = mongoose.model("QuyenCuaChucVu", QuyenCuaChucVuSchema);
