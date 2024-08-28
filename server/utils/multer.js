import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Function to configure Multer
const configureMulter = () => {
  // Determine the directory of the current file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Set up the path for the uploads directory
  const uploadDir = path.resolve(__dirname, '../dp-uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure Multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Set the destination directory
    },
    filename: (req, file, cb) => {
      // Use username from the request body or a default value
      const username = req.body.username || 'unknown_user';
      const fileExtension = path.extname(file.originalname); // Extract file extension
      cb(null, `${file.originalname}_dp${fileExtension}`); // Set the filename
    },
  });

  // Return the configured Multer instance
  return multer({ storage: storage });
};

export default configureMulter;
