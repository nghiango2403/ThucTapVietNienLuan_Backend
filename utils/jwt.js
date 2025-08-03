const jwt = require("jsonwebtoken");
const TaoToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
};
const XacThucToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return null;
  }
};
module.exports = {
  TaoToken,
  XacThucToken,
};
