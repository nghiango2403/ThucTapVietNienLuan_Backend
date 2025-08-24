const service = require("../services/mainservice");
const thanhtoanservice = require("../services/thanhtoanservice");
const { XacThucToken, TaoToken } = require("../utils/jwt");

const LaSo = (so) => {
  return !isNaN(so) && !isNaN(parseFloat(so));
};
const lammoiaccesstoken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Refresh token không được để trống" });
  }
  try {
    const decoded = XacThucToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decoded) {
      return res.status(403).json({ message: "Refresh token không hợp lệ" });
    }
    const newAccessToken = TaoToken(
      {
        TenDangNhap: decoded.TenDangNhap,
        HoTen: decoded.HoTen,
        ChucVu: decoded.ChucVu,
        MaChucVu: decoded.MaChucVu,
        MaNhanSu: decoded.MaNhanSu,
        MaNhanVien: decoded.MaNhanVien,
      },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES
    );
    return res.status(200).json({
      status: 200,
      message: "Làm mới access token thành công",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themchucvu = async (req, res) => {
  const { TenChucVu } = req.body;

  try {
    const result = await service.ThemChucVu(TenChucVu);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemchucvu = async (req, res) => {
  try {
    const result = await service.XemChucVu();
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xoachucvu = async (req, res) => {
  try {
    const result = await service.XoaChucVu(req.body.MaChucVu);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themnhanvienvataikhoan = async (req, res) => {
  try {
    const result = await service.ThemNhanVienVaTaiKhoan(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const dangnhap = async (req, res) => {
  console.log("Đang xử lý đăng nhập");
  try {
    const result = await service.LayThongTinDangNhap(req.body);
    if (result.status !== 200) {
      return res.status(result.status).json(result);
    }
    const ThongTin = {
      TenDangNhap: result.data.TenDangNhap,
      HoTen: result.data.MaNhanSu.HoTen,
      ChucVu: result.data.MaChucVu.TenChucVu,
      MaChucVu: result.data.MaChucVu._id,
      MaNhanSu: result.data.MaNhanSu._id,
      MaNhanVien: result.data._id,
    };

    const accessToken = TaoToken(
      ThongTin,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRES
    );
    const refreshToken = TaoToken(
      ThongTin,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRES
    );
    return res.status(200).json({
      status: 200,
      message: "Đăng nhập thành công",
      data: {
        accessToken,
        refreshToken,
        ThongTin,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const doimatkhau = async (req, res) => {
  try {
    const { MaNhanSu } = req.user;
    const result = await service.DoiMatKhau(MaNhanSu, req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const laythongtintaikhoan = async (req, res) => {
  try {
    const result = await service.LayThongTinTaiKhoan(req.user);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const doithongtintaikhoan = async (req, res) => {
  try {
    const { MaNhanSu } = req.user;
    const result = await service.DoiThongTinTaiKhoan(MaNhanSu, req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemdanhsachnhanvien = async (req, res) => {
  try {
    const result = await service.XemDanhSachNhanVien();
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const timnhanvien = async (req, res) => {
  try {
    const result = await service.TimNhanVien(req.query.TenNhanVien);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemthongtinchitietcuanhanvien = async (req, res) => {
  try {
    const result = await service.XemThongTinChiTietCuaNhanVien(
      req.query.MaTaiKhoan
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const doithongtinnhanvien = async (req, res) => {
  try {
    const result = await service.DoiThongTinTaiKhoan(
      req.query.MaNhanSu,
      req.query
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const doimatkhaunhanvien = async (req, res) => {
  try {
    const result = await service.DoiMatKhauNhanVien(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};

const mohoackhoataikhoan = async (req, res) => {
  try {
    const result = await service.MoHoacKhoaTaiKhoan(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themhanghoa = async (req, res) => {
  try {
    if (!LaSo(req.body.Gia)) {
      return res.status(409).json({
        status: 409,
        message: "Giá phải là số",
      });
    }
    const result = await service.ThemHangHoa(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const timhanghoa = async (req, res) => {
  try {
    const result = await service.TimHangHoa(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const capnhathanghoa = async (req, res) => {
  try {
    const result = await service.CapNhatHangHoa(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const taophieunhaphang = async (req, res) => {
  try {
    for (const item of req.body.DanhSach) {
      if (!LaSo(item.SoLuong) || !LaSo(item.TienHang)) {
        return res.status(409).json({
          status: 409,
          message: "Số lượng và tiền phải là kiểu số",
        });
      }
    }
    const result = await service.TaoPhieuNhapHang(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const layphieunhaphang = async (req, res) => {
  try {
    const result = await service.LayPhieuNhapHang(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const laychitietphieunhaphang = async (req, res) => {
  try {
    const result = await service.LayChiTietPhieuNhapHang(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xoaphieunhaphang = async (req, res) => {
  try {
    const result = await service.XoaPhieuNhapHang(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themkhuyenmai = async (req, res) => {
  try {
    if (!LaSo(req.body.TienKhuyenMai) || !LaSo(req.body.DieuKien)) {
      return res.status(409).json({
        status: 409,
        message: "Tiền khuyến mãi và điều kiện phải là số",
      });
    }
    const result = await service.ThemKhuyenMai(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const capnhatkhuyenmai = async (req, res) => {
  try {
    if (!LaSo(req.query.TienKhuyenMai) || !LaSo(req.query.DieuKien)) {
      return res.status(409).json({
        status: 409,
        message: "Tiền khuyến mãi và điều kiện phải là số",
      });
    }

    const result = await service.CapNhatKhuyenMai(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemkhuyenmai = async (req, res) => {
  try {
    const result = await service.XemKhuyenMai(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const laykhuyenmaibangid = async (req, res) => {
  try {
    const result = await service.LayKhuyenMaiBangId(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemkhuyenmaiconhoatdong = async (req, res) => {
  try {
    const result = await service.XemKhuyenMaiConHoatDong();
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themhoadon = async (req, res) => {
  try {
    console.log(req.body);
    const result = await service.ThemHoaDon(req.body, req.user.MaNhanSu);
    console.log("a:", result);
    if (result.status !== 200) {
      return res.status(result.status).json(result);
    }
    const km = await service.LayThongTinHoaDon(result.data.MaHoaDon);
    let ThongTinKhuyenMai = null;
    if (km.status === 200) {
      ThongTinKhuyenMai = km.data.MaKhuyenMai;
    }
    if (req.body.HinhThucThanhToan === "MoMo") {
      response = await thanhtoanservice.TaoThanhToanMoMo(
        result.data.MaHoaDon,
        result.data.items,
        ThongTinKhuyenMai
      );
      return res.status(response.status).json(response);
    }
    if (req.body.HinhThucThanhToan === "ZaloPay") {
      response = await thanhtoanservice.TaoThanhToanZaLoPay(
        result.data.MaHoaDon,
        result.data.items,
        ThongTinKhuyenMai
      );
      if (req.body.HinhThucThanhToan === "VnPay") {
        response = await thanhtoanservice.TaoThanhToanVnPay(
          req,
          result.data,
          ThongTinKhuyenMai
        );
      }
      return res.status(response.status).json(response);
    }
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemdanhsachhoadon = async (req, res) => {
  try {
    const result = await service.XemDanhSachHoaDon(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemdanhsachhoadoncuanhanvien = async (req, res) => {
  try {
    const result = await service.XemDanhSachHoaDonCuaNhanVien(
      req.query,
      req.user.MaNhanSu
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemchitiethoadon = async (req, res) => {
  try {
    const result = await service.XemChiTietHoaDon(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xoahoadon = async (req, res) => {
  try {
    console.log(req.body);
    const result = await service.XoaHoaDon(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const taothanhtoanmomo = async (req, res) => {
  try {
    const result1 = await service.XemChiTietHoaDon(req.body);
    if (result1.status !== 200) {
      return res.status(result1.status).json(result1);
    }
    const km = await service.LayThongTinHoaDon(req.body.MaHoaDon);
    let ThongTinKhuyenMai = null;
    if (km.status === 200) {
      ThongTinKhuyenMai = km.data.MaKhuyenMai;
    }

    const response = await thanhtoanservice.TaoThanhToanMoMo(
      req.body.MaHoaDon,
      result1.data,
      ThongTinKhuyenMai
    );
    return res.status(response.status).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const kiemtratrangthaithanhtoan = async (req, res) => {
  try {
    const layhoadon = await service.LayHoaDon(req.query.MaHoaDon);
    if (layhoadon.status !== 200)
      return res.status(layhoadon.status).json(layhoadon);
    if (layhoadon.data.HinhThucThanhToan == "ZaloPay") {
      const result = await thanhtoanservice.KiemTraTrangThaiThanhToanZaLoPay(
        req.query.MaHoaDon
      );
      return res.status(result.status).json(result);
    }
    if (layhoadon.data.HinhThucThanhToan == "VnPay") {
      const result = await thanhtoanservice.KiemTraTrangThaiThanhToanVnPay(
        req.body
      );
      return res.status(result.status).json(result);
    }
    if (layhoadon.data.HinhThucThanhToan == "MoMo") {
      const result = await thanhtoanservice.KiemTraTrangThaiThanhToanMoMo(
        req.query
      );
      return res.status(result.status).json(result);
    }
    // const result = await thanhtoanservice;
    // return res.status(result.status).json(result);
    return res.status(200).json(layhoadon);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const taolaithanhtoan = async (req, res) => {
  try {
    const xoathanhtooan = await service.XoaThanhToan(req.body.MaHoaDon);
    if (xoathanhtooan.status !== 200)
      return res.status(xoathanhtooan.status).json(xoathanhtooan);
    const thongtinhd = await service.LayHoaDon(req.body.MaHoaDon);
    if (thongtinhd.status !== 200) {
      return res.status(thongtinhd.status).json(thongtinhd);
    }
    const km = await service.LayThongTinHoaDon(req.body.MaHoaDon);
    let ThongTinKhuyenMai = null;
    if (km.status === 200) {
      ThongTinKhuyenMai = km.data.MaKhuyenMai;
    }
    const layitem = await service.XemChiTietHoaDon({
      MaHoaDon: req.body.MaHoaDon,
    });
    if (layitem.status !== 200) {
      return res.status(layitem.status).json(layitem);
    }
    if (thongtinhd.data.HinhThucThanhToan === "MoMo") {
      response = await thanhtoanservice.TaoThanhToanMoMo(
        req.body.MaHoaDon,
        layitem.data,
        ThongTinKhuyenMai
      );
      return res.status(response.status).json(response);
    }
    if (thongtinhd.data.HinhThucThanhToan === "ZaloPay") {
      response = await thanhtoanservice.TaoThanhToanZaLoPay(
        req.body.MaHoaDon,
        layitem.data,
        ThongTinKhuyenMai
      );
      if (thongtinhd.data.HinhThucThanhToan === "VnPay") {
        response = await thanhtoanservice.TaoThanhToanVnPay(
          req,
          layitem.data,
          ThongTinKhuyenMai
        );
      }
      return res.status(response.status).json(response);
    }

    return res
      .status(200)
      .json({ status: 400, message: "Không tìm thấy hình thức thanh toán" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xulythanhtoanmomo = async (req, res) => {
  try {
    const result = await thanhtoanservice.XuLyThanhToanMoMo(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const kiemtratrangthaithanhtoanmomo = async (req, res) => {
  try {
    const result = await thanhtoanservice.KiemTraTrangThaiThanhToanMoMo(
      req.body
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const taothanhtoanzalopay = async (req, res) => {
  try {
    const result1 = await service.XemChiTietHoaDon(req.body);
    if (result1.status !== 200) {
      return res.status(result1.status).json(result1);
    }
    const km = await service.LayThongTinHoaDon(req.body.MaHoaDon);
    let ThongTinKhuyenMai = null;
    if (km.status === 200) {
      ThongTinKhuyenMai = km.data.MaKhuyenMai;
    }
    const result = await thanhtoanservice.TaoThanhToanZaLoPay(
      req.body.MaHoaDon,
      result1.data,
      ThongTinKhuyenMai
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xulythanhtoanzalopay = async (req, res) => {
  try {
    const result = await thanhtoanservice.XuLyThanhToanZaLoPay(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const kiemtratrangthaithanhtoanzalopay = async (req, res) => {
  try {
    const result = await thanhtoanservice.KiemTraTrangThaiThanhToanZaLoPay(
      req.body.MaHoaDon
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const taothanhtoanvnpay = async (req, res) => {
  try {
    const result1 = await service.XemChiTietHoaDon(req.body);
    if (result1.status !== 200) {
      return res.status(result1.status).json(result1);
    }
    const km = await service.LayThongTinHoaDon(req.body.MaHoaDon);
    let ThongTinKhuyenMai = null;
    if (km.status === 200) {
      ThongTinKhuyenMai = km.data.MaKhuyenMai;
    }
    const result = await thanhtoanservice.TaoThanhToanVnPay(
      req,
      result1.data,
      ThongTinKhuyenMai
    );
    return res
      .status(200)
      .json({ status: 200, message: "Thành công", data: result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xulythanhtoanvnpay = async (req, res) => {
  try {
    const result = await thanhtoanservice.XuLyThanhToanVnPay(req);

    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Không xác định kết quả thanh toán" });
    }

    // Nếu đang render view "success", hãy chắc chắn view này tồn tại
    console.log("Kết quả thanh toán:", result);
    return res.json({ success: true, code: result });
  } catch (error) {
    console.error("Lỗi xử lý thanh toán:", error);
    return res
      .status(400)
      .json({ success: false, message: "Sai chữ ký (invalid checksum)" });
  }
};

const kiemtratrangthaithanhtoanvnpay = async (req, res) => {
  try {
    const result = await thanhtoanservice.KiemTraTrangThaiThanhToanVnPay(req);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themquyen = async (req, res) => {
  try {
    const result = await service.ThemQuyen(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xoaquyen = async (req, res) => {
  try {
    const result = await service.XoaQuyen(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xemquyen = async (req, res) => {
  try {
    const result = await service.XemQuyen();
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const suaquyen = async (req, res) => {
  try {
    const result = await service.SuaQuyen(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themquyencuachucvu = async (req, res) => {
  try {
    const result = await service.ThemQuyenCuaChucVu(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const xoaquyencuachucvu = async (req, res) => {
  try {
    const result = await service.XoaQuyenCuaChucVu(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const layquyencuachucvu = async (req, res) => {
  try {
    const result = await service.LayQuyenCuaChucVu(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const laythongtinhoadon = async (req, res) => {
  try {
    const result = await service.LayThongTinHoaDon(req.query.MaHoaDon);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const thongkenhaphang = async (req, res) => {
  try {
    const result = await service.ThongKeNhapHang(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const thongkebanhang = async (req, res) => {
  try {
    const result = await service.ThongKeBanHang(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const thongketonkho = async (req, res) => {
  try {
    const result = await service.ThongKeTonKho();
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const thongkedoanhthu = async (req, res) => {
  try {
    const result = await service.ThongKeDoanhThu(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
module.exports = {
  themchucvu,
  xemchucvu,
  xoachucvu,
  themnhanvienvataikhoan,
  dangnhap,
  lammoiaccesstoken,
  doimatkhau,
  laythongtintaikhoan,
  doithongtintaikhoan,
  xemdanhsachnhanvien,
  timnhanvien,
  xemthongtinchitietcuanhanvien,
  doithongtinnhanvien,
  doimatkhaunhanvien,
  mohoackhoataikhoan,
  themhanghoa,
  timhanghoa,
  capnhathanghoa,
  taophieunhaphang,
  layphieunhaphang,
  laychitietphieunhaphang,
  xoaphieunhaphang,
  themkhuyenmai,
  capnhatkhuyenmai,
  xemkhuyenmai,
  xemkhuyenmaiconhoatdong,
  themhoadon,
  kiemtratrangthaithanhtoan,
  xemdanhsachhoadon,
  taolaithanhtoan,
  xemdanhsachhoadoncuanhanvien,
  xemchitiethoadon,
  xoahoadon,
  taothanhtoanmomo,
  xulythanhtoanmomo,
  kiemtratrangthaithanhtoanmomo,
  taothanhtoanzalopay,
  xulythanhtoanzalopay,
  kiemtratrangthaithanhtoanzalopay,
  taothanhtoanvnpay,
  xulythanhtoanvnpay,
  kiemtratrangthaithanhtoanvnpay,
  themquyen,
  xoaquyen,
  xemquyen,
  suaquyen,
  themquyencuachucvu,
  xoaquyencuachucvu,
  layquyencuachucvu,
  laythongtinhoadon,
  laykhuyenmaibangid,
  thongkenhaphang,
  thongkebanhang,
  thongketonkho,
  thongkedoanhthu,
};
