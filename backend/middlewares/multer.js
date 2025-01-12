import multer from 'multer';

// Set up multer storage (in-memory storage)
const storage = multer.memoryStorage();

// Create multer instance with file size limit and storage configuration
const singleUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('file'); // 'file' should match the field name from the client request

// Middleware to skip file upload if not provided
const handleFileUpload = (req, res, next) => {
  singleUpload(req, res, (err) => {
    if (err && err.code !== 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ message: 'File upload error', success: false });
    }

    // If no file is uploaded, skip the file handling
    if (!req.file) {
      return next(); // Continue to the next middleware if no file
    }

    // If file is uploaded, handle the file and proceed
    next();
  });
};

export default handleFileUpload;
