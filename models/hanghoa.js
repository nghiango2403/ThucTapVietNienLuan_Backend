const mongoose = require("mongoose");

const HoangHoaSchema = mongoose.Schema({
  Ten: {
    type: String,
    required: true,
  },
  Gia: {
    type: Number,
    required: true,
  },
  SoLuong: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("HangHoa", HoangHoaSchema);
