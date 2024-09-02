import User from "../models/userLinkModel.js";
import path from "path";

/*
  @route  : /api/admin/user/:username
  @method : GET
  @params : { username }
  @description :
    * Retrieves user data from the database based on the provided username in the URL parameters.
    * If the user does not exist in the database, returns a 404 (Not Found) response with an error message.
    * If the user exists and has an associated image, constructs a full URL to the image file stored on the server.
    * Returns the user data as a JSON object, including the constructed image URL if available.
    * If any error occurs during the process (e.g., database issues), logs the error and returns a 500 (Internal Server Error) response with an appropriate error message.
*/


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
      const imageUrl = user.image
        ? `${req.protocol}://${req.get("host")}/dp-uploads/${path.basename(
            user.image
          )}`
        : null;
  
      // Send the user data as JSON including the image URL
      res.status(200).json({
        ...user.toObject(),
        image: imageUrl, // Include the image URL in the response
      });
    } catch (error) {
      console.log("Error from getUserDataController:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  }

  export { getUserDataController }