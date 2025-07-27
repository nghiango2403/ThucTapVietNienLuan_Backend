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
    const result = await thanhtoanservice.TaoThanhToanMoMo(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Lỗi service" });
  }
};
const sulythanhtoanmomo = async (req, res) => {
  try {
    const result = await thanhtoanservice.SuLyThanhToanMoMo(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
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
  sulythanhtoanmomo,
};
