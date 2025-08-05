const mongoose = require("mongoose");

const QuyenCuaChucVuSchema = new mongoose.Schema({
  MaChucVu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChucVu",
    required: true,
  },
  MaQuyen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quyen",
    required: true,
  },
});

module.exports = mongoose.model("QuyenCuaChucVu", QuyenCuaChucVuSchema);
