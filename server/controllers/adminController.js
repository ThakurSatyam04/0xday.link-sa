import User from "../models/userLinkModel.js";
import configureMulter from "../utils/multer.js";
import path from "path";

async function adminPageController(req, res) {
  try {
    res.send("Welcome to admin dashboard");
  } catch (error) {
    console.log("Error from adminPageController", error);
  }
}

const upload = configureMulter().single("dp");

/* 
  @route  : /api/admin/add-user
  @method : POST
  @body   : { username: , bio: , linkedInId: , githubId: , instaId: , xId: , fbId }
  @description :
    * Handles file upload and user data submission.
    * If the username already exists in the database, sends a 409 (Conflict) response.
    * Validates that all required fields (username, bio, linkedInId, githubId, instaId, xId, fbId) are provided.
    * If a file is uploaded, stores the relative path for the image.
    * Creates a new User document and saves it to the database.
    * If successful, returns the saved user data with a 201 (Created) response.
    * Handles errors, such as file upload issues or database save failures, and returns appropriate error responses.
*/

function userDataSubmitController(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = req.file;
    const { username, bio, linkedInId, githubId, instaId, xId, fbId } =
      req.body;

      const user = await User.findOne({username});

      if(user) {
        return res.status(409).json({error: "This user already exists in Database"});
      }

    // Validate required fields
    if (
      !username ||
      !bio ||
      !linkedInId ||
      !githubId ||
      !instaId ||
      !xId ||
      !fbId
    ) {
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
      res
        .status(500)
        .json({ error: "Failed to save user data (user already exist)" });
    }
  });
}

/*
  @route  : /api/admin/update-user/:username
  @method : PUT
  @params : { username }
  @description :
    * Fetches user data from the database based on the provided username.
    * If the user does not exist, returns a 404 (Not Found) response with an appropriate error message.
    * If the user is found and has an image, constructs the full URL for the image and includes it in the response.
    * Sends the user data as a JSON object, including the image URL if available.
    * Handles any errors that occur during the database query or data processing, returning a 500 (Internal Server Error) response.
*/


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
        if (key !== "dp") {
          // Exclude dp if not already handled
          if (user[key] !== undefined) {
            // Ensure key is valid
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
  adminPageController,
  userDataSubmitController,
  updateUserController,
};
