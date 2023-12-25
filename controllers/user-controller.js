const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/jwt-token");
const sendSMS = require("../services/sms-service");
const { generateOTP, saveOTP } = require("../services/user-otp-service");

const sendOTPMessage = async (req, res) => {
    const data = req.body;
    const { mobileNo } = data;
    console.log("mobileNo", mobileNo)

    try {
        const otp = await generateOTP();
        await saveOTP(mobileNo, otp);
        const sendSms = await sendSMS(mobileNo, otp);
        res.status(200).json({
            data: sendSms,
            code: 200,
            status_code: 'success',
            message: 'Message sent successfully.',
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            code: 500,
            status_code: "error",
            message: 'Failed to send message.',
        });
    }
};

const signupOTP = async(req, res) => {
    const data = req.body;
    const { mobileNo } = data;
    console.log("mobileNo", mobileNo)
    try{
        const existingUser = await User.findOne({ mobileNo: mobileNo })
        if (existingUser) {
            return res.status(400).json({ code: 400, status_code: 'error', message: 'user already exist' })
        }
        await sendOTPMessage(req, res);
    }
    catch (error){
        return res.status(500).json({code:500, status_code:"error"})
    }
}

const signup = async (req, res) => {
    //Existing user check
    const { username, mobileNo, password } = req.body;
    try {
        const existingUser = await User.findOne({ mobileNo: mobileNo })
        if (existingUser) {
            return res.status(400).json({ code: 400, status_code: 'error', message: 'user already exist' })
        }
        //Hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        //user create
        const user = await User.create({
            mobileNo: mobileNo,
            password: hashedPassword,
            username: username
        })
        //token generate
        const token = generateToken(user._id, user.mobileNo);
        return res.status(201).json({ data: { token, user, isNew: false }, code: 200, status_code: "success", message: "User updated successfully." })

    } catch (error) {
        console.log("error");
        res.status(500).json({ message: "something went wrong" });
    }

}

const signin = async (req, res) => {
    const { mobileNo, password } = req.body;
    try {
        const existingUser = await User.findOne({ mobileNo: mobileNo });
        if (!existingUser) {
            return res.status(404).json({ message: "user not found" });
        }
        console.log(existingUser)
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        const token = generateToken(existingUser._id, existingUser.mobileNo);
        return res.status(201).json({ data: { token, existingUser }, code: 200, status_code: "success", message: "User login successfull." });

    } catch (error) {
        console.log("error");
        res.status(500).json({ message: "something went wrong" });
    }
}

const updatePassword = async (req, res) => {
    const {mobileNo, newPassword} = req.body;
    try{
        const userDetail = await User.findOne({mobileNo:mobileNo});
        if(!userDetail){
            return res.status(404).json({code:404, status_code:"Not Found", message: "user not found"});
        }
        //Hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateUser = await User.findOneAndUpdate({mobileNo:mobileNo},{password: hashedPassword});

        if(!updateUser){
            return res.status(500).json({code:500, status_code:"error", message:"failed to update password"});
        }

        return res.status(200).json({code:200, status_code:"success", message:"password updated successfully"});
    }
    catch (error){
        console.log("error")
        return res.status(500).json({code:500, status_code:"error", message:"something went wrong"})
    }
}

module.exports = { signup, signin, sendOTPMessage, updatePassword, signupOTP }