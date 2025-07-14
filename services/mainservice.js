const mongoose = require("mongoose");
const NhanSu = require("../models/nhansu");
const TaiKhoan = require("../models/taikhoan");
const ChucVu = require("../models/chucvu");

const ThemChucVu = async (TenChucVu) => {
  try {
    const chucvu = await ChucVu.create({ TenChucVu });
    return {
      status: 200,
      message: "Tạo chức vụ thành công",
      data: chucvu,
    };
  } catch (error) {
    return {
      status: 400,
      message: "Lỗi tạo chức vụ",
    };
  }
};
const XemChucVu = async () => {
  try {
    const chucvu = await ChucVu.find();
    return {
      status: 200,
      message: "Lấy chức vụ thành công",
      data: chucvu,
    };
  } catch (error) {
    return {
      status: 400,
      message: "Lỗi khi lấy chức vụ",
    };
  }
};
const XoaChucVu = async (id) => {
  try {
    const chucvu = await ChucVu.findByIdAndDelete(id);
    return {
      status: 200,
      message: "Xóa chức vụ thành công",
    };
  } catch (error) {
    return {
      status: 400,
      message: "Lỗi xóa chức vụ",
    };
  }
};

module.exports = { ThemChucVu, XemChucVu, XoaChucVu };
