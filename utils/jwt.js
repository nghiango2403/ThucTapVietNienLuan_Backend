const jwt = require("jsonwebtoken");
const TaoToken = async (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
};
const XacThucToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
};
module.exports = {
  TaoToken,
  XacThucToken,
};
