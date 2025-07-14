const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { TaoToken } = require("../utils/jwt");
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
const MaHoaMatKhau = async (MatKhau) => {
  const saltRounds = 10;
  const MatKhauDaMaHoa = await bcrypt.hash(MatKhau, saltRounds);
  return MatKhauDaMaHoa;
};
const KiemTraMaHoa = async (MatKhau, MatKhauDaMaHoa) => {
  const checkMatKhau = await bcrypt.compare(MatKhau, MatKhauDaMaHoa);
  return checkMatKhau;
};
const ThemNhanVienVaTaiKhoan = async ({
  HoTen,
  SDT,
  Email,
  NgaySinh,
  DiaChi,
  GioiTinh,
  MatKhau,
  MaChucVu,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const nhansu = await NhanSu.create(
      [{ HoTen, SDT, Email, NgaySinh, DiaChi, GioiTinh }],
      { session }
    );
    const TaiKhoanCuoi = await TaiKhoan.findOne({})
      .sort({ TenDangNhap: -1 })
      .select("TenDangNhap")
      .lean();

    let TenDangNhapMoi = "TK00001";
    if (TaiKhoanCuoi && TaiKhoanCuoi.TenDangNhap) {
      const numberPart = parseInt(TaiKhoanCuoi.TenDangNhap.slice(2)) + 1;
      TenDangNhapMoi = "TK" + numberPart.toString().padStart(5, "0");
    }
    const MatKhauDaMaHoa = await MaHoaMatKhau(MatKhau);
    const taikhoan = await TaiKhoan.create(
      [
        {
          TenDangNhap: TenDangNhapMoi,
          MatKhau: MatKhauDaMaHoa,
          MaNhanSu: nhansu[0]._id,
          MaChucVu,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      status: 201,
      message: "Tạo nhân viên và tài khoản thành công",
      data: {
        taikhoan: taikhoan[0],
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return {
      status: 400,
      message: "Thêm nhân viên và tài khoản thất bại",
      error: error.message,
    };
  }
};
const DangNhap = async ({ TenDangNhap, MatKhau }) => {
  try {
    const taikhoan = await TaiKhoan.findOne({ TenDangNhap })
      .populate({
        path: "MaNhanSu",
        select: "HoTen",
      })
      .populate("MaChucVu");

    if (!taikhoan) {
      return {
        status: 400,
        message: "Sai tên đăng nhập hoặc mật khẩu",
      };
    }
    const checkMatKhau = await bcrypt.compare(MatKhau, taikhoan.MatKhau);
    if (!checkMatKhau) {
      return {
        status: 400,
        message: "Sai tên đăng nhập hoặc mật khẩu",
      };
    }
    const ThongTin = {
      TenDangNhap: taikhoan.TenDangNhap,
      HoTen: taikhoan.MaNhanSu.HoTen,
      ChucVu: taikhoan.MaChucVu.TenChucVu,
      MaChucVu: taikhoan.MaChucVu._id,
      MaNhanSu: taikhoan.MaNhanSu._id,
    };
    const accessToken = await TaoToken(
      ThongTin,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES
    );
    const refreshToken = await TaoToken(
      ThongTin,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRES
    );
    return {
      status: 200,
      message: "Đăng nhập thành công",
      data: {
        accessToken,
        refreshToken,
        ThongTin,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi đăng nhập",
    };
  }
};
const DoiMatKhau = async (MaNhanSu, { MatKhauCu, MatKhauMoi }) => {
  try {
    const taikhoan = await TaiKhoan.findOne({ MaNhanSu });
    const checkMatKhau = await bcrypt.compare(MatKhauCu, taikhoan.MatKhau);
    if (!checkMatKhau) {
      return {
        status: 400,
        message: "Sai mật khẩu",
      };
    }
    const MatKhauMaHoa = await MaHoaMatKhau(MatKhauMoi);
    await TaiKhoan.updateOne({ MaNhanSu }, { MatKhau: MatKhauMaHoa });
    return {
      status: 200,
      message: "Đổi mật khẩu thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi đăng nhập",
    };
  }
};
const LayThongTinTaiKhoan = async ({ MaNhanSu }) => {
  try {
    const taikhoan = await NhanSu.findById(MaNhanSu);
    return {
      status: 200,
      message: "Lấy thông tin tài khoản",
      data: taikhoan,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi lấy thông tin tài khoản",
    };
  }
};
const DoiThongTinTaiKhoan = async (
  MaNhanSu,
  { HoTen, SDT, Email, NgaySinh, DiaChi, GioiTinh }
) => {
  try {
    if (!MaNhanSu) {
      return {
        status: 400,
        message: "Thiếu mã nhân sự để cập nhật",
      };
    }
    const data = await NhanSu.findByIdAndUpdate(MaNhanSu, {
      HoTen,
      SDT,
      Email,
      NgaySinh,
      DiaChi,
      GioiTinh: parseInt(GioiTinh),
    });
    return {
      status: 200,
      message: "Đổi thông tin tài khoản thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi đổi thống tin tài khoản",
    };
  }
};
module.exports = {
  ThemChucVu,
  XemChucVu,
  XoaChucVu,
  ThemNhanVienVaTaiKhoan,
  DangNhap,
  DoiMatKhau,
  LayThongTinTaiKhoan,
  DoiThongTinTaiKhoan,
};
