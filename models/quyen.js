const mongoose = require("mongoose");

const QuyenSchema = new mongoose.Schema({
  TenQuyen: { type: String, required: true },
  Url: { type: String, required: true },
});

module.exports = mongoose.model("Quyen", QuyenSchema);
