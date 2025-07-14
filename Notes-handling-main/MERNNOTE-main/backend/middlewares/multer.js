// middlewares/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure public directory exists
const uploadDir = './public';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // .pdf
    cb(null, file.fieldname + '-' + uniqueSuffix); // file-1728131291.pdf
  }
});

// Only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const uploadm = multer({
  storage,
  fileFilter
});

export default uploadm;


// import multer from 'multer';
// const storage = multer.memoryStorage();
// export const uploadm = multer({ storage });