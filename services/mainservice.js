const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const NhanSu = require("../models/nhansu");
const TaiKhoan = require("../models/taikhoan");
const ChucVu = require("../models/chucvu");
const HangHoa = require("../models/hanghoa");
const PhieuNhapHang = require("../models/phieunhaphang");
const ChiTietPhieuNhapHang = require("../models/chitietphieunhaphang");
const KhuyenMai = require("../models/khuyenmai");
const HoaDon = require("../models/hoadon");
const ChiTietHoaDon = require("../models/chitiethoadon");
const Quyen = require("../models/quyen");

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
  console.log("Xoá chức vụ với ID:", id);
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
const LayThongTinDangNhap = async ({ TenDangNhap, MatKhau }) => {
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
    const checkMatKhau = await KiemTraMaHoa(MatKhau, taikhoan.MatKhau);
    if (!checkMatKhau) {
      return {
        status: 400,
        message: "Sai tên đăng nhập hoặc mật khẩu",
      };
    }
    return {
      status: 200,
      message: "Lấy thông tin đăng nhập thành công",
      data: taikhoan,
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
    const checkMatKhau = await KiemTraMaHoa(MatKhauCu, taikhoan.MatKhau);
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
    await NhanSu.findByIdAndUpdate(MaNhanSu, {
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
const XemDanhSachNhanVien = async ({ Trang, Dong }) => {
  try {
    const tongSoLuong = await TaiKhoan.countDocuments();
    const danhSachNhanVien = await TaiKhoan.find({})
      .select("TenDangNhap NgaySinh KichHoat")
      .populate({ path: "MaNhanSu", select: "HoTen GioiTinh" })
      .populate("MaChucVu")
      .skip((Trang - 1) * Dong)
      .limit(Dong);
    return {
      status: 200,
      message: "Lấy danh sách nhân viên",
      data: {
        danhsach: danhSachNhanVien,
        sotrang: Math.ceil(tongSoLuong / Dong),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi lấy danh sách nhân viên",
    };
  }
};
const TimNhanVien = async (TenNhanVien) => {
  try {
    const nhanViens = await NhanSu.find({
      HoTen: { $regex: TenNhanVien, $options: "i" },
    });

    if (nhanViens.length === 0) {
      return {
        status: 400,
        message: "Không tìm thấy nhân viên",
      };
    }

    const taiKhoans = await TaiKhoan.find({
      MaNhanSu: { $in: nhanViens.map((nv) => nv._id) },
    })
      .select("TenDangNhap KichHoat")
      .populate("MaNhanSu")
      .populate("MaChucVu");

    return {
      status: 200,
      message: "Lấy thông tin nhân viên",
      data: taiKhoans,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi lấy thông tin nhân viên",
    };
  }
};
const XemThongTinChiTietCuaNhanVien = async (MaTaiKhoan) => {
  try {
    const thongTinNhanVien = await TaiKhoan.findById(MaTaiKhoan)
      .select("TenDangNhap KichHoat")
      .populate("MaNhanSu")
      .populate("MaChucVu");
    return {
      status: 200,
      message: "Lấy thống tin chi tiết nhân viên thành công",
      data: thongTinNhanVien,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi lấy thống tin chi tiết nhân viên",
    };
  }
};
const DoiMatKhauNhanVien = async ({ MaTaiKhoan, MatKhau }) => {
  try {
    const MatKhauMaHoa = await MaHoaMatKhau(MatKhau);
    console.log(MaTaiKhoan);
    await TaiKhoan.findByIdAndUpdate(MaTaiKhoan, {
      MatKhau: MatKhauMaHoa,
    });
    return {
      status: 200,
      message: "Đổi mật khẩu thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi đổi mật khẩu",
    };
  }
};
const DoiChucVu = async ({ MaTaiKhoan, MaChucVu }) => {
  try {
    await TaiKhoan.findByIdAndUpdate(MaTaiKhoan, {
      MaChucVu,
    });
    return {
      status: 200,
      message: "Đổi chức vụ thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi đổi chức vụ",
    };
  }
};
const MoHoacKhoaTaiKhoan = async ({ MaTaiKhoan }) => {
  try {
    const tk = await TaiKhoan.findById(MaTaiKhoan);
    if (!tk) {
      return {
        status: 400,
        message: "Không tìm thấy tài khoản",
      };
    }
    tk.KichHoat = !tk.KichHoat;
    await tk.save();
    return {
      status: 200,
      message: "Mở hoặc khoá tài khoản thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi mở/khoá tài khoản",
    };
  }
};
const ThemHangHoa = async ({ Ten, Gia }) => {
  try {
    await HangHoa.create({ Ten, Gia });
    return {
      status: 200,
      message: "Thêm sản phẩm thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi thêm sản phẩm",
    };
  }
};
const TimHangHoa = async ({ Ten, Trang, Dong }) => {
  try {
    const dieuKien = { Ten: { $regex: Ten, $options: "i" } };

    const tongSoLuong = await HangHoa.countDocuments(dieuKien);

    const sp = await HangHoa.find(dieuKien)
      .skip((Trang - 1) * Dong)
      .limit(Dong);

    const sotrang = Math.ceil(tongSoLuong / Dong);

    return {
      status: 200,
      message: "Tìm sản phẩm thành công",
      data: { danhsach: sp, sotrang },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi tìm sản phẩm",
    };
  }
};

const CapNhatHangHoa = async ({ MaHangHoa, Ten, Gia }) => {
  try {
    await HangHoa.findByIdAndUpdate(MaHangHoa, { Ten, Gia });
    return {
      status: 200,
      message: "Cập nhật hàng hóa thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi cập nhật hàng hóa",
    };
  }
};
const TaoPhieuNhapHang = async ({ DanhSach }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [phieunhaphang] = await PhieuNhapHang.create([{}], { session });
    const chitietpnh = DanhSach.map((item) => {
      return {
        MaHangHoa: item.MaHangHoa,
        SoLuong: item.SoLuong,
        TienHang: item.TienHang,
        MaPhieuNhapHang: phieunhaphang._id,
      };
    });
    await ChiTietPhieuNhapHang.create(chitietpnh);
    for (const item of DanhSach) {
      await HangHoa.updateOne(
        { _id: item.MaHangHoa },
        { $inc: { SoLuong: item.SoLuong } },
        { session }
      );
    }
    await session.commitTransaction();
    session.endSession();
    return {
      status: 200,
      message: "Tạo phiếu nhập hàng thành công",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return {
      status: 400,
      message: "Loi khi tạo phiếu nhập hàng",
    };
  }
};
const LayPhieuNhapHang = async ({ Trang, Dong }) => {
  try {
    const tongSoLuong = await PhieuNhapHang.countDocuments();

    const phieunhaphang = await PhieuNhapHang.find({})
      .sort({ ThoiGianNhap: -1 })
      .skip((Trang - 1) * Dong)
      .limit(Dong);

    const sotrang = Math.ceil(tongSoLuong / Dong);

    return {
      status: 200,
      message: "Lấy danh sách phiếu nhập hàng thành công",
      data: { danhsach: phieunhaphang, sotrang },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lấy danh sách phiếu nhập hàng thất bại",
    };
  }
};

const LayChiTietPhieuNhapHang = async ({ MaPhieuNhapHang }) => {
  try {
    const chitietphieunhaphang = await ChiTietPhieuNhapHang.find({
      MaPhieuNhapHang,
    }).populate({ path: "MaHangHoa", select: "Ten Gia" });
    return {
      status: 200,
      message: "Lấy thành công",
      data: chitietphieunhaphang,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lấy danh sách chi tiết phiếu nhập hàng thất bại",
    };
  }
};
const XoaPhieuNhapHang = async ({ MaPhieuNhapHang }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const phieunhaphang = await PhieuNhapHang.findById(MaPhieuNhapHang).session(
      session
    );
    if (!phieunhaphang) {
      await session.abortTransaction();
      session.endSession();
      return {
        status: 400,
        message: "Phiếu nhập hàng không tồn tại",
      };
    }

    const chitietphieunhaphang = await ChiTietPhieuNhapHang.find({
      MaPhieuNhapHang,
    }).session(session);

    for (const item of chitietphieunhaphang) {
      const hanghoa = await HangHoa.findById(item.MaHangHoa).session(session);
      if (!hanghoa) {
        throw new Error(`Hàng hóa với ID ${item.MaHangHoa} không tồn tại`);
      }

      if (hanghoa.SoLuong < item.SoLuong) {
        throw new Error(
          `Số lượng hàng hóa (${hanghoa.SoLuong}) trong kho nhỏ hơn số lượng (${item.SoLuong}) cần trừ`
        );
      }
      await HangHoa.updateOne(
        { _id: item.MaHangHoa },
        { $inc: { SoLuong: -item.SoLuong } },
        { session }
      );
    }

    await ChiTietPhieuNhapHang.deleteMany({ MaPhieuNhapHang }, { session });
    await PhieuNhapHang.deleteOne({ _id: MaPhieuNhapHang }, { session });

    await session.commitTransaction();
    session.endSession();
    return {
      status: 200,
      message: "Xóa phiếu nhập hàng thành công",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return {
      status: 400,
      message: error.message || "Lỗi khi xoá phiếu nhập hàng",
    };
  }
};
const ThemKhuyenMai = async ({
  TenKhuyenMai,
  NgayBatDau,
  NgayKetThuc,
  TienKhuyenMai,
  DieuKien,
}) => {
  try {
    const km = await KhuyenMai.create({
      TenKhuyenMai,
      NgayBatDau,
      NgayKetThuc,
      TienKhuyenMai,
      DieuKien,
    });
    return {
      status: 200,
      message: "Thêm khuyến mãi thành công",
      data: km,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi thêm khuyến mãi",
    };
  }
};
const CapNhatKhuyenMai = async ({
  MaKhuyenMai,
  TenKhuyenMai,
  NgayBatDau,
  NgayKetThuc,
  TienKhuyenMai,
  DieuKien,
}) => {
  try {
    await KhuyenMai.updateOne(
      { _id: MaKhuyenMai },
      { TenKhuyenMai, NgayBatDau, NgayKetThuc, TienKhuyenMai, DieuKien }
    );
    return {
      status: 200,
      message: "Cập nhật khuyến mãi thành công",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi cập nhật khuyến mãi",
    };
  }
};
const XemKhuyenMai = async ({ Trang, Dong }) => {
  try {
    const tongSoLuong = await KhuyenMai.countDocuments();

    const km = await KhuyenMai.find({})
      .sort({ NgayKetThuc: -1 })
      .skip((Trang - 1) * Dong)
      .limit(Dong);

    const sotrang = Math.ceil(tongSoLuong / Dong);

    return {
      status: 200,
      message: "Lấy danh sách khuyến mãi thành công",
      data: { danhsach: km, sotrang },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lấy danh sách khuyến mãi thất bại",
    };
  }
};

const XemKhuyenMaiConHoatDong = async ({ Trang, Dong }) => {
  try {
    const today = new Date();
    const dieuKien = {
      NgayBatDau: { $lte: today },
      NgayKetThuc: { $gte: today },
    };

    const tongSoLuong = await KhuyenMai.countDocuments(dieuKien);

    const km = await KhuyenMai.find(dieuKien)
      .sort({ NgayKetThuc: -1 })
      .skip((Trang - 1) * Dong)
      .limit(Dong);

    const sotrang = Math.ceil(tongSoLuong / Dong);

    return {
      status: 200,
      message: "Lấy danh sách khuyến mãi hệ thống",
      data: { danhsach: km, sotrang },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lấy danh sách khuyến mãi hệ thống thất bại",
    };
  }
};

const ThemHoaDon = async (
  { MaKhuyenMai, HinhThucThanhToan, ChiTietHD },
  MaNhanVien
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    var tienhd = 0;
    for (const item of ChiTietHD) {
      const a = await HangHoa.findById(item.MaHangHoa).session(session);
      console.log(a);
      tienhd += a.Gia * item.SoLuong;
    }
    if (MaKhuyenMai) {
      const km = await KhuyenMai.findById(MaKhuyenMai).session(session);
      if (km.DieuKien > tienhd) {
        return {
          status: 409,
          message: "Tiền hoá đơn chưa đủ để áp dụng khuyến mãi",
        };
      }
    } else {
      MaKhuyenMai = null;
    }
    const [hoadon] = await HoaDon.create(
      [{ MaKhuyenMai, HinhThucThanhToan, MaNhanVien }],
      { session }
    );
    for (const item of ChiTietHD) {
      const hanghoa = await HangHoa.findById(item.MaHangHoa).session(session);
      await ChiTietHoaDon.create(
        [
          {
            MaHoaDon: hoadon._id,
            MaHangHoa: item.MaHangHoa,
            SoLuong: item.SoLuong,
            DonGia: hanghoa.Gia,
          },
        ],
        { session }
      );
      await HangHoa.updateOne(
        { _id: item.MaHangHoa },
        { $inc: { SoLuong: -item.SoLuong } },
        { session }
      );
    }
    await session.commitTransaction();
    session.endSession();
    const CTHD = await XemChiTietHoaDon({ MaHoaDon: hoadon._id });

    console.log(hoadon._id);
    return {
      status: 200,
      message: "Tạo hóa đơn thành công",
      data: { items: CTHD.data, MaHoaDon: hoadon._id },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return {
      status: 400,
      message: "Lỗi khi tạo hóa đơn",
    };
  }
};
const XemDanhSachHoaDon = async ({ Trang, Dong, Thang, Nam }) => {
  try {
    const BatDau = new Date(Nam, Thang - 1, 1);
    const KetThuc = new Date(Nam, Thang, 1);

    const dieuKien = {
      NgayLap: {
        $gte: BatDau,
        $lt: KetThuc,
      },
    };

    const tongSoLuong = await HoaDon.countDocuments(dieuKien);

    const hd = await HoaDon.find(dieuKien)
      .sort({ NgayLap: -1 })
      .skip((Trang - 1) * Dong)
      .limit(Dong);

    const soTrang = Math.ceil(tongSoLuong / Dong);

    return {
      status: 200,
      message: "Lấy danh sách hóa đơn thành công",
      data: { danhsach: hd, soTrang },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lấy danh sách hóa đơn thất bại",
    };
  }
};

const XemDanhSachHoaDonCuaNhanVien = async (
  { Trang, Dong, Thang, Nam },
  MaNhanVien
) => {
  try {
    const BatDau = new Date(Nam, Thang - 1, 1);
    const KetThuc = new Date(Nam, Thang, 1);

    const dieuKien = {
      MaNhanVien,
      NgayLap: {
        $gte: BatDau,
        $lt: KetThuc,
      },
    };

    const tongSoLuong = await HoaDon.countDocuments(dieuKien);

    const hd = await HoaDon.find(dieuKien)
      .sort({ NgayLap: -1 })
      .skip((Trang - 1) * Dong)
      .limit(Dong);

    const sotrang = Math.ceil(tongSoLuong / Dong);

    return {
      status: 200,
      message: "Lấy danh sách hóa đơn của nhân viên thành công",
      data: {
        danhsach: hd,
        sotrang,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lấy danh sách hóa đơn của nhân viên thất bại",
    };
  }
};

const XemChiTietHoaDon = async ({ MaHoaDon }) => {
  try {
    const hd = await ChiTietHoaDon.find({ MaHoaDon }).populate({
      path: "MaHangHoa",
      select: "-SoLuong",
    });
    return {
      status: 200,
      message: "Lấy chi tiết hóa đơn thành công",
      data: hd,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Lấy chi tiết hóa đơn thất bại",
    };
  }
};
const XoaHoaDon = async ({ MaHoaDon }) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const ct = await ChiTietHoaDon.find({ MaHoaDon }).session(session);
    for (const item of ct) {
      await HangHoa.updateOne(
        { _id: item.MaHangHoa },
        { $inc: { SoLuong: item.SoLuong } },
        { session }
      );
    }

    await ChiTietHoaDon.deleteMany({ MaHoaDon }, { session });
    await HoaDon.deleteOne({ _id: MaHoaDon }, { session });
    await session.commitTransaction();
    session.endSession();
    return {
      status: 200,
      message: "Xóa hóa đơn thành công",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return {
      status: 400,
      message: "Xóa hóa đơn thất bại",
    };
  }
};
const ThemQuyen = async ({ TenQuyen, Url }) => {
  try {
    const ThemQuyen = await Quyen.create({ TenQuyen, Url });
    return {
      status: 200,
      message: "Thêm quyền thành công",
      data: ThemQuyen,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Lỗi khi kiểm tra quyền",
    };
  }
};
const XoaQuyen = async ({ MaQuyen }) => {
  try {
    const XoaQuyen = await Quyen.deleteOne({ _id: MaQuyen });
    return {
      status: 200,
      message: "Xoá quyền thành công",
      data: XoaQuyen,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Lỗi khi xoá quyền",
    };
  }
};
const XemQuyen = async () => {
  try {
    const QuyenList = await Quyen.find({});
    return {
      status: 200,
      message: "Lấy danh sách quyền thành công",
      data: QuyenList,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Lỗi khi lấy danh sách quyền",
    };
  }
};
const SuaQuyen = async ({ MaQuyen, TenQuyen, Url }) => {
  try {
    const SuaQuyen = await Quyen.updateOne({ _id: MaQuyen }, { TenQuyen, Url });
    return {
      status: 200,
      message: "Sửa quyền thành công",
      data: SuaQuyen,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Lỗi khi sửa quyền",
    };
  }
};
module.exports = {
  ThemChucVu,
  XemChucVu,
  XoaChucVu,
  ThemNhanVienVaTaiKhoan,
  LayThongTinDangNhap,
  DoiMatKhau,
  LayThongTinTaiKhoan,
  DoiThongTinTaiKhoan,
  XemDanhSachNhanVien,
  TimNhanVien,
  XemThongTinChiTietCuaNhanVien,
  DoiMatKhauNhanVien,
  DoiChucVu,
  MoHoacKhoaTaiKhoan,
  ThemHangHoa,
  TimHangHoa,
  CapNhatHangHoa,
  TaoPhieuNhapHang,
  LayPhieuNhapHang,
  LayChiTietPhieuNhapHang,
  XoaPhieuNhapHang,
  ThemKhuyenMai,
  CapNhatKhuyenMai,
  XemKhuyenMai,
  XemKhuyenMaiConHoatDong,
  ThemHoaDon,
  XemDanhSachHoaDon,
  XemDanhSachHoaDonCuaNhanVien,
  XemChiTietHoaDon,
  XoaHoaDon,
  ThemQuyen,
  XoaQuyen,
  XemQuyen,
  SuaQuyen,
};
