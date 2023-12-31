const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; // secret key

function generateToken(userId, mobileNo) {
  const payload = { userId, mobileNo };

  const options = { expiresIn: '6h' }; // Token expiration time

  return jwt.sign(payload, secretKey, options);
}

function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ code: 401, status_code: "error", error: 'Token missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ code: 403, status_code: "error", error: 'Invalid token' });
    }

    // Token is valid, proceed to the next middleware or route
    req.user = decoded;
    next();
  });
}

module.exports = { generateToken, verifyAdminToken }