const express = require("express");
const { signup, signin, sendOTPMessage, updatePassword, signupOTP } = require("../controllers/user-controller");
const { verifyOTP } = require("../services/user-otp-service");
const { verifyAdminToken } = require("../middleware/jwt-token");
const router = express.Router();

router.put('/signup', signup);
router.post('/signin', signin);
router.post('/sendotp', sendOTPMessage);
router.post('/send-signup-otp', signupOTP)
router.post('/verifyotp', verifyOTP);
router.put('/update-password', updatePassword);

module.exports = router;