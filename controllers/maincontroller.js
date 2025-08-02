const service = require("../services/mainservice");
const thanhtoanservice = require("../services/thanhtoanservice");

const LaSo = (so) => {
  return typeof so === "number";
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
    const result = await service.XoaChucVu(req.params.id);
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
  try {
    const result = await service.DangNhap(req.body);
    return res.status(result.status).json(result);
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
    const result = await service.XemDanhSachNhanVien(req.query);
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
const doichucvu = async (req, res) => {
  try {
    const result = await service.DoiChucVu(req.query);
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
    if (!LaSo(req.body.Gia)) {
      return res.status(400).json({
        status: 400,
        message: "Giá phải là số",
      });
    }
    const result = await service.CapNhatHangHoa(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
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
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const capnhatkhuyenmai = async (req, res) => {
  try {
    if (!LaSo(req.body.TienKhuyenMai) || !LaSo(req.body.DieuKien)) {
      return res.status(409).json({
        status: 409,
        message: "Tiền khuyến mãi và điều kiện phải là số",
      });
    }
    const result = await service.CapNhatKhuyenMai(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
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
const xemkhuyenmaiconhoatdong = async (req, res) => {
  try {
    const result = await service.XemKhuyenMaiConHoatDong(req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const themhoadon = async (req, res) => {
  try {
    const result = await service.ThemHoaDon(req.body, req.user.MaNhanVien);
    if (result.status !== 200) {
      return res.status(result.status).json(result);
    }
    if (req.body.HinhThucThanhToan === "MoMo") {
      response = await thanhtoanservice.TaoThanhToanMoMo(
        result.data.MaHoaDon,
        result.data.items
      );
      return res.status(response.status).json(response);
    }
    if (req.body.HinhThucThanhToan === "ZaLoPay") {
      response = await thanhtoanservice.TaoThanhToanZaLoPay(
        result.data.MaHoaDon,
        result.data.items
      );
      if (req.body.HinhThucThanhToan === "VnPay") {
        response = await thanhtoanservice.TaoThanhToanVnPay(req, result.data);
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
      req.user.MaNhanVien
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
    const result = await service.XoaHoaDon(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const taothanhtoanmomo = async (req, res) => {
  try {
    const result1 = await service.XemChiTietHoaDon(req.body);
    if (result1.status !== 200) {
      return res.status(result1.status).json(result1);
    }
    const response = await thanhtoanservice.TaoThanhToanMoMo(
      req.body.MaHoaDon,
      result1.data
    );
    return res.status(response.status).json(response);
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
    const result = await thanhtoanservice.TaoThanhToanZaLoPay(
      req.body.MaHoaDon,
      result1.data
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
    const result = await thanhtoanservice.TaoThanhToanVnPay(req, result1.data);
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
    console.log(req.body);
    const result = await thanhtoanservice.KiemTraTrangThaiThanhToanVnPay(req);
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
  doimatkhau,
  laythongtintaikhoan,
  doithongtintaikhoan,
  xemdanhsachnhanvien,
  timnhanvien,
  xemthongtinchitietcuanhanvien,
  doithongtinnhanvien,
  doimatkhaunhanvien,
  doichucvu,
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
  xemdanhsachhoadon,
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
};
