import { sendSMS } from "../utils/sendSMS.js";
import Otp from "../models/otpModel.js";
import User from "../models/userLinkModel.js";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import cookie from "cookie";
import configureMulter from "../utils/multer.js";
import path from 'path'

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

    const success = { success: { msg: "OTP sent successfully" } };
    return res.status(200).json(success);
  } catch (error) {
    console.log("Error from sendOTPController", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

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
      const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
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

      res.status(200).json({token});
    } else {
      console.log("Invalid OTP");
      res.status(401).send("Invalid OTP");
    }
  } catch (error) {
    console.log("Error from validateOTPController", error);
  }
}

async function adminPageController(req, res) {
  try {
    res.send("Welcome to admin dashboard");
  } catch (error) {
    console.log("Error from adminPageController", error);
  }
}

const upload = configureMulter().single('dp');

function userDataSubmitController(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = req.file;
    const { username, bio, linkedInId, githubId, instaId, xId, fbId } = req.body;

    // Validate required fields
    if (!username || !bio || !linkedInId || !githubId || !instaId || !xId || !fbId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imagePath = "";
    if (file) {
      imagePath = `/dp-uploads/${file.filename}`; // Store relative path for serving via HTTP
      console.log("File uploaded:", imagePath);
    }

    try {
      const newUser = new User({
        image: imagePath,
        username,
        bio,
        linkedInId,
        githubId,
        instaId,
        xId,
        fbId,
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.log("Error from userDataSubmitController:", error);
      res.status(500).json({ error: "Failed to save user data (user already exist)" });
    }
  });
}

async function getUserDataController(req, res) {
  const { username } = req.params;
  try {
    // Fetch the user based on the username
    const user = await User.findOne({ username });
    console.log("user from here", user);

    // If no user is found, return a 404 status
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the image URL if an image is available
    const imageUrl = user.image ? `${req.protocol}://${req.get('host')}/dp-uploads/${path.basename(user.image)}` : null;

    // Send the user data as JSON including the image URL
    res.status(200).json({
      ...user.toObject(),
      image: imageUrl // Include the image URL in the response
    });

  } catch (error) {
    console.log("Error from getUserDataController:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}


async function updateUserController(req, res) {
  const { username } = req.params;

  // Handle file upload with multer
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      // Fetch the user by username
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Log incoming updates (fields)
      console.log("Incoming Updates:", req.body);

      // Update user fields with the data from the request body
      const updates = req.body;
      Object.keys(updates).forEach((key) => {
        if (key !== 'dp') { // Exclude dp if not already handled
          if (user[key] !== undefined) { // Ensure key is valid
            user[key] = updates[key];
          } else {
            console.log(`Attempted to update invalid field: ${key}`);
          }
        }
      });

      // Handle file upload if there's any
      if (req.file) {
        user.image = `/dp-uploads/${req.file.filename}`; // Save the file path in the user model
      }

      // Save the updated user
      await user.save();

      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Error from updateUserController:", error.message);
      res.status(500).json({ error: "Failed to update user data" });
    }
  });
}



export {
  sendOTPController,
  validateOTPController,
  adminPageController,
  userDataSubmitController,
  getUserDataController,
  updateUserController
};
