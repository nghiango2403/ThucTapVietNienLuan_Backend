const service = require("../services/mainservice");
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
module.exports = {
  themchucvu,
  xemchucvu,
  xoachucvu,
};
