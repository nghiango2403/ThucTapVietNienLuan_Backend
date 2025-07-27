const axios = require("axios");
const crypto = require("crypto");
const ThanhToan = require("../models/thanhtoan");
const TaoThanhToanMoMo = async ({ MaHoaDon }) => {
  const accessKey = process.env.ACCESSKEYMOMO;
  const secretKey = process.env.SECRETKEYMOMO;
  const partnerCode = "MOMO";
  const orderInfo = "Thanh toán tiền hàng";
  const redirectUrl = "https://www.google.com/";
  const ipnUrl = `${process.env.LINKCALLBACK}/sulythanhtoanmomo`;
  const requestType = "payWithMethod";
  const lang = "vi";
  const autoCapture = true;
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";
  try {
    const result = await ThanhToan.create({ _id: orderId, MaHoaDon });
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "loi",
    };
  }
  // Danh sách sản phẩm
  const items = [
    {
      id: "204727",
      name: "YOMOST Bac Ha&Viet Quat 170ml",
      imageUrl:
        "https://cdn.tgdd.vn/Products/Images/2944/84114/bhx/loc-4-hop-sua-chua-uong-huong-cam-yomost-170ml-202104091433463810.jpg",
      price: 11000,
      quantity: 5,
      totalPrice: 55000,
      currency: "VND",
    },
    {
      id: "204728",
      name: "Number One Active 350ml",
      imageUrl:
        "https://cdn.tgdd.vn/Products/Images/2944/84114/bhx/loc-4-hop-sua-chua-uong-huong-cam-yomost-170ml-202104091433463810.jpg",
      price: 8000,
      quantity: 3,
      totalPrice: 24000,
      currency: "VND",
    },
    {
      id: "204722",
      name: "Giảm giá 1",
      imageUrl:
        "https://cdn.tgdd.vn/Products/Images/2944/84114/bhx/loc-4-hop-sua-chua-uong-huong-cam-yomost-170ml-202104091433463810.jpg",
      price: -8000,
      quantity: 1,
      totalPrice: -8000,
      currency: "VND",
    },
  ];

  // Tính tổng amount (tổng totalPrice của tất cả items)
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const amount = totalAmount.toString();

  // Tạo chữ ký
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  // Payload gửi đi
  const requestBody = {
    partnerCode,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    signature,
    items,
  };

  try {
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      status: 200,
      data: response.data,
    };
  } catch (error) {
    console.error("Lỗi gửi yêu cầu đến MoMo:");
    console.error(error.response?.data || error.message);

    return {
      status: 500,
      message: "Gửi thanh toán thất bại",
      error: error.response?.data || error.message,
    };
  }
};
const SuLyThanhToanMoMo = async (reqbody) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = reqbody;

    const rawSignature = `accessKey=${process.env.ACCESSKEYMOMO}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.SECRETKEYMOMO)
      .update(rawSignature)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("🚫 Chữ ký không hợp lệ từ MoMo!");
      return {
        status: 400,
        message: "Sai chữ ký",
      };
    }

    const order = await ThanhToan.findById(orderId);

    if (!order) {
      console.log("Không tìm thấy đơn hàng");
      return {
        status: 404,
        message: "Không tìm thấy đơn hàng",
      };
    }
    order.MaGiaoDich = transId;
    order.ThoiGianThanhToan = new Date(Number(responseTime));
    order.TrangThaiThanhToan = true;
    await order.save();

    return {
      status: 200,
      message: "Thành công",
    };
  } catch (err) {
    console.error("Lỗi xử lý từ MoMo:", err);
    return {
      status: 500,
      message: "Lỗi xử lý từ MoMo",
    };
  }
};
module.exports = {
  TaoThanhToanMoMo,
  SuLyThanhToanMoMo,
};
