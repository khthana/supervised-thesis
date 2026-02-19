const multer = require("multer");
const fs = require("fs");

const ensureUploadDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createUploader = (folder) => {
  ensureUploadDirExists(folder);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  });

  return multer({ storage: storage });
};

const uploadPostImages = createUploader("imgPostContent");
const uploadCommentImages = createUploader("imgCommentContent");
const uploadReplyImages = createUploader("imgReplyContent");

module.exports = { uploadPostImages, uploadCommentImages, uploadReplyImages };
