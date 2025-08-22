const axios = require("axios");
const crypto = require("crypto");
const moment = require("moment");
let qs = require("qs");
const ThanhToan = require("../models/thanhtoan");
const TaoThanhToanMoMo = async (MaHoaDon, item, km) => {
  const accessKey = process.env.ACCESSKEYMOMO;
  const secretKey = process.env.SECRETKEYMOMO;
  const partnerCode = process.env.PARTNER_CODE_MOMO;
  const orderInfo = "Thanh toán tiền hàng";
  const redirectUrl = process.env.LINKRETURN;
  const ipnUrl = `${process.env.LINKCALLBACK}/xulythanhtoanmomo`;
  const requestType = "payWithMethod";
  const lang = "vi";
  const autoCapture = true;
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";
  try {
    await ThanhToan.create({ _id: orderId, MaHoaDon });
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "loi",
    };
  }
  const items = item.map((i) => ({
    id: i.MaHangHoa._id.toString(),
    name: i.MaHangHoa.Ten,
    quantity: i.SoLuong,
    price: i.DonGia,
    totalPrice: i.SoLuong * i.DonGia,
    currency: "VND",
  }));
  if (km) {
    items.push({
      id: km._id.toString(),
      name: km.TenKhuyenMai,
      quantity: 1,
      price: -km.TienKhuyenMai,
      totalPrice: -km.TienKhuyenMai,
      currency: "VND",
    });
  }

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const amount = totalAmount.toString();

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

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
      process.env.MOMO_CREATE_URL,
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      status: 201,
      data: { url: response.data.payUrl, MaThanhToan: orderId },
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
const XuLyThanhToanMoMo = async (reqbody) => {
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
      console.warn("Chữ ký không hợp lệ từ MoMo!");
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
    if (resultCode != 0) {
      order.ThoiGianThanhToan = new Date(Number(responseTime));
      order.TrangThaiThanhToan = "Thất bại";
      await order.save();
      return {
        status: 400,
        message: message,
      };
    }
    order.ThoiGianThanhToan = new Date(Number(responseTime));
    order.TrangThaiThanhToan = "Thành công";
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
const KiemTraTrangThaiThanhToanMoMo = async ({ MaHoaDon }) => {
  try {
    const order = await ThanhToan.findOne({ MaHoaDon });

    if (!order) {
      return {
        status: 404,
        message: "Không tìm thấy đơn hàng",
      };
    }
    if (order.TrangThaiThanhToan && order.TrangThaiThanhToan == "Thành công") {
      return {
        status: 200,
        message: "Đã lấy trạng thái thanh toán từ DB",
        data: order.TrangThaiThanhToan,
      };
    }

    const partnerCode = process.env.PARTNER_CODE_MOMO;
    const accessKey = process.env.ACCESSKEYMOMO;
    const secretKey = process.env.SECRETKEYMOMO;
    const orderId = order._id;
    const requestId = order._id;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const body = {
      partnerCode,
      accessKey,
      requestId,
      orderId,
      signature,
      lang: "vi",
    };

    const response = await axios.post(process.env.MOMO_TRANSACTION_URL, body, {
      headers: { "Content-Type": "application/json" },
    });

    const momoData = response.data;
    if (momoData.resultCode === 0 && momoData.transId) {
      order.TrangThaiThanhToan = "Thành công";
      order.MaGiaoDich = momoData.transId;
      await order.save();
    } else if (momoData.resultCode !== 1000) {
      order.TrangThaiThanhToan = "Thất bại";
      await order.save();
    }
    return {
      status: 200,
      message: "Đã lấy trạng thái thanh toán từ MoMo",
      data: order.TrangThaiThanhToan,
    };
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
    return {
      status: 500,
      message: "Lỗi khi kiểm tra trạng thái thanh toán",
    };
  }
};
const TaoThanhToanZaLoPay = async (MaHoaDon, item, km) => {
  const transID = Math.floor(Math.random() * 1000000);
  const app_trans_id = `${moment().format("YYMMDD")}_${transID}`;
  try {
    await ThanhToan.create({ _id: "ZALOPAY" + app_trans_id, MaHoaDon });
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "loi",
    };
  }
  const embed_data = {
    redirecturl: process.env.LINKRETURN,
  };
  const items = item.map((i) => ({
    itemid: i.MaHangHoa._id.toString(),
    itemname: i.MaHangHoa.Ten,
    itemprice: i.DonGia,
    itemquantity: i.SoLuong,
  }));
  if (km) {
    items.push({
      itemid: km._id.toString(),
      itemname: km.TenKhuyenMai,
      itemprice: -km.TienKhuyenMai,
      itemquantity: 1,
    });
  }
  const amount = items.reduce(
    (sum, i) => sum + i.itemquantity * i.itemprice,
    0
  );
  const order = {
    app_id: process.env.APP_ZALOPAY_ID,
    app_trans_id,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount,
    description: `Mã thanh toán là: ZALOPAY${app_trans_id}`,
    bank_code: "",
    callback_url: process.env.LINKCALLBACK + "/xulythanhtoanzalopay",
  };

  const data =
    process.env.APP_ZALOPAY_ID +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = crypto
    .createHmac("sha256", process.env.KEY_ZALOPAY_1)
    .update(data)
    .digest("hex");
  try {
    const result = await axios.post(process.env.ZALOPAY_URL, null, {
      params: order,
    });
    return {
      status: 201,
      data: {
        url: result.data.order_url,
        MaThanhToan: "ZALOPAY" + app_trans_id,
      },
    };
  } catch (error) {
    console.log(error.response?.data || error);
    return {
      status: 400,
      message: "Lỗi khi tạo thanh toán",
    };
  }
};

const XuLyThanhToanZaLoPay = async (reqbody) => {
  let result = {};
  try {
    let dataStr = reqbody.data;
    let reqMac = reqbody.mac;
    let mac = crypto
      .createHmac("sha256", process.env.KEY_ZALOPAY_2)
      .update(dataStr)
      .digest("hex");
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr, process.env.KEY_ZALOPAY_2);
      const order = await ThanhToan.findById(
        "ZALOPAY" + dataJson["app_trans_id"]
      );
      if (!order) {
        console.log("Không tìm thấy đơn hàng");
        result.return_code = -1;
        result.return_message = "Không tìm thấy đơn hàng";
        return result;
      }
      order.ThoiGianThanhToan = new Date(Number(dataJson["server_time"]));
      order.TrangThaiThanhToan = "Thành công";
      await order.save();

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.log("a:", ex);
    result.return_code = 0;
    result.return_message = ex.message;
  }
  return result;
};
const KiemTraTrangThaiThanhToanZaLoPay = async (MaHoaDon) => {
  try {
    const order = await ThanhToan.findOne({ MaHoaDon });
    if (!order) {
      return {
        status: 404,
        message: "Không tìm thấy đơn hàng",
      };
    }
    if (order.TrangThaiThanhToan && order.TrangThaiThanhToan === "Thành công") {
      return {
        status: 200,
        message: "Đã lấy trạng thái thanh toán từ DB",
        data: order.TrangThaiThanhToan,
      };
    }

    const app_id = parseInt(process.env.APP_ZALOPAY_ID);
    const key1 = process.env.KEY_ZALOPAY_1;
    const app_trans_id = order._id.replace("ZALOPAY", "");
    const dataStr = `${app_id}|${app_trans_id}|${key1}`;
    const mac = crypto.createHmac("sha256", key1).update(dataStr).digest("hex");
    const response = await axios.post(
      process.env.ZALOPAY_TRANSACTION_URL,
      {
        app_id,
        app_trans_id,
        mac,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const zaloData = response.data;
    console.log("Kết quả kiểm tra trạng thái ZaloPay:", zaloData);
    if (
      zaloData.return_code === 1 &&
      zaloData.data &&
      zaloData.data.status === 1
    ) {
      order.TrangThaiThanhToan = "Thành công";
      order.MaGiaoDich = zaloData.data.zp_trans_id;
      await order.save();
    } else if (zaloData.data && zaloData.data.status === -1) {
      order.TrangThaiThanhToan = "Thất bại";
      await order.save();
    }
    return {
      status: 200,
      message: "Đã lấy trạng thái thanh toán từ ZaloPay",
      data: order.TrangThaiThanhToan,
    };
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái thanh toán ZaloPay:", error);
    return {
      status: 500,
      message: "Lỗi khi kiểm tra trạng thái thanh toán ZaloPay",
    };
  }
};
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();

  for (let key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }

  return sorted;
}
const TaoThanhToanVnPay = async (req, item, km) => {
  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");
  let MaHoaDon = req.body.MaHoaDon;

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = process.env.VNP_TMNCODE;
  let secretKey = process.env.VNP_HASHSECRET;
  let vnpUrl = process.env.VNP_URL;
  let returnUrl = process.env.LINKRETURN;
  let orderId = moment(date).format("DDHHmmss");
  try {
    await ThanhToan.create({ _id: "VNPAY" + orderId, MaHoaDon });
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "loi",
    };
  }
  const items = item.map((i) => ({
    itemid: i.MaHangHoa._id.toString(),
    itemname: i.MaHangHoa.Ten,
    itemprice: i.DonGia,
    itemquantity: i.SoLuong,
  }));
  if (km) {
    items.push({
      itemid: km._id.toString(),
      itemname: km.TenKhuyenMai,
      itemprice: -km.TienKhuyenMai,
      itemquantity: 1,
    });
  }
  const amount = items.reduce(
    (sum, i) => sum + i.itemquantity * i.itemprice,
    0
  );
  let bankCode = "";

  let locale = "vn";

  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + "VNPAY" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let signed = crypto
    .createHmac("sha512", secretKey)
    .update(signData)
    .digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  return {
    status: 201,
    data: {
      url: vnpUrl,
      MaThanhToan: "VNPAY" + orderId,
    },
  };
};
const XuLyThanhToanVnPay = async (req) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.VNP_HASHSECRET;
    let signData = qs.stringify(vnp_Params, { encode: false });
    let signed = crypto
      .createHmac("sha512", secretKey)
      .update(signData)
      .digest("hex");

    if (secureHash !== signed) {
      console.log("Sai chữ ký");
      return "97";
    }

    const { vnp_ResponseCode, vnp_TxnRef, vnp_TransactionStatus, vnp_PayDate } =
      vnp_Params;
    if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
      const order = await ThanhToan.findById("VNPAY" + vnp_TxnRef);
      if (!order) {
        console.log("Không tìm thấy đơn hàng");
        return "01";
      }

      order.ThoiGianThanhToan = new Date(Number(vnp_PayDate));
      order.TrangThaiThanhToan = "Thành công";
      await order.save();

      return "00";
    } else {
      console.log("Giao dịch thất bại:", vnp_ResponseCode);
      return vnp_ResponseCode;
    }
  } catch (error) {
    console.error("Lỗi trong xử lý thanh toán:", error);
    return "99";
  }
};

const KiemTraTrangThaiThanhToanVnPay = async (req) => {
  const { MaHoaDon } = req.body;

  if (!MaHoaDon) {
    return {
      status: 400,
      message: "Không tìm thấy mã hóa đơn",
    };
  }

  const order = await ThanhToan.findOne({ MaHoaDon });
  if (!order) {
    return {
      status: 404,
      message: "Không tìm thấy đơn hàng",
    };
  }

  if (order.TrangThaiThanhToan === "Thành công") {
    return {
      status: 200,
      message: "Đã thanh toán (từ DB)",
      data: order.TrangThaiThanhToan,
    };
  }

  const date = new Date();

  const vnp_TmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;
  const vnp_transaction_url = process.env.VNP_TRANSACTION_URL;

  const vnp_TxnRef = order._id.replace("VNPAY", "");
  const vnp_TransactionDate = moment(order.ThoiGianTao).format(
    "YYYYMMDDHHmmss"
  );

  const vnp_RequestId = moment(date).format("HHmmss");
  const vnp_Version = "2.1.0";
  const vnp_Command = "querydr";
  const vnp_OrderInfo = `Truy van GD ma: ${vnp_TxnRef}`;
  const vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  const rawData = [
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_OrderInfo,
  ].join("|");
  const vnp_SecureHash = crypto
    .createHmac("sha512", secretKey)
    .update(rawData)
    .digest("hex");

  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash,
  };

  try {
    const response = await axios.post(vnp_transaction_url, dataObj, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let message = "";
    switch (response.data.vnp_ResponseCode) {
      case "00":
        message = "Thanh toán thành công";
        order.ThoiGianThanhToan = new Date(Number(response.data.vnp_PayDate));
        order.TrangThaiThanhToan = "Thành công";
        await order.save();
        break;
      case "91":
        message =
          "Không tìm thấy giao dịch (có thể chưa thanh toán hoặc sai mã)";
        break;
      case "97":
        message = "Sai chữ ký (invalid signature)";
        break;
      case "94":
        message = "Giao dịch bị trùng";
        break;
      case "24":
        message = "Giao dịch bị hủy bởi người dùng";
        break;
      case "12":
        message = "Giao dịch bị từ chối";
        break;
      default:
        message = "Lỗi không xác định hoặc mã không được xử lý";
        break;
    }
    return {
      status: 200,
      message: "Đã truy vấn trạng thái thanh toán từ VNPAY",
      data: response.data,
    };
  } catch (error) {
    console.error("Lỗi truy vấn trạng thái VNPAY:", error.message);
    return {
      status: 500,
      message: "Lỗi hệ thống khi truy vấn VNPAY",
      error: error.message,
    };
  }
};
module.exports = {
  TaoThanhToanMoMo,
  XuLyThanhToanMoMo,
  KiemTraTrangThaiThanhToanMoMo,
  TaoThanhToanZaLoPay,
  XuLyThanhToanZaLoPay,
  KiemTraTrangThaiThanhToanZaLoPay,
  TaoThanhToanVnPay,
  XuLyThanhToanVnPay,
  KiemTraTrangThaiThanhToanVnPay,
};
