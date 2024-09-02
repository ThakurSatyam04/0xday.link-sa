import { sendSMS } from "../utils/sendSMS.js";
import Otp from "../models/otpModel.js";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import cookie from "cookie";

/* 
  @route  : /api/auth/send-otp
  @method : POST
  @body   : { phoneNumber: }
  @description :
    * If the phone number is registred in database,
    * OTP gets generated and sent to the registred admin
    * Store the OTP in the database from sertain time.
*/

async function sendOTPController(req, res) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "phoneNumber required" });
    }

    const admin = await Admin.findOne({ phoneNumber });

    if (!admin) {
      return res
        .status(403)
        .send({ error: "Provided phone number not authorized as admin" });
    }

    const otpcode = String(Math.floor(100000 + Math.random() * 900000));

    await sendSMS(phoneNumber, otpcode);

    // Store the OTP in MongoDB
    const newOtp = new Otp({ phoneNumber, otpcode });
    await newOtp.save();

    const success = { success: { msg: "OTP sent successfully", otp:otpcode } };
    return res.status(200).json(success);
  } catch (error) {
    console.log("Error from sendOTPController", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/* 
  @route  : /api/auth/verify-otp
  @method : POST
  @body   : { phoneNumber: , otpcode: }
  @description :
    * If the phone number and the otpcode is invalid, then give the admin access.
    * For valid credentials, creates and sends a JWT.
*/

async function validateOTPController(req, res) {
  const { phoneNumber, otpcode } = req.body;
  try {
    const cleanPhoneNumber = phoneNumber.trim();
    const cleanOtpcode = otpcode.trim();

    const otpRecord = await Otp.findOne({
      phoneNumber: cleanPhoneNumber,
      otpcode: cleanOtpcode,
    });

    if (otpRecord) {
      // JWT Payload

      const payload = {
        id: otpRecord._id,
        phoneNumber: cleanPhoneNumber,
        otpcode: cleanOtpcode,
      };

      const token = jwt.sign(payload, 'sherlock', {expiresIn: '1h'});
      // Set JWT in cookies
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
          maxAge: 60 * 60, // Cookie expires in 1 hour
          sameSite: "Strict",
          path: "/", // The path on which the cookie will be sent
        })
      );

      res.status(200).json({ token });
    } else {
      console.log("Invalid OTP");
      res.status(401).send("Invalid OTP");
    }
  } catch (error) {
    console.log("Error from validateOTPController", error);
  }
}


export { sendOTPController, validateOTPController };
