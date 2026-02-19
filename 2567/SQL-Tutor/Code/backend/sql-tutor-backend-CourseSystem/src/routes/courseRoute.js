const express = require("express");
const multer = require("multer");

const {
  getAllMainTopics,
  getMainTopicById,
  getSubTopicById,
  getContentById,
  createOrUpdateMainTopic,
  createSubTopic,
  updateSubTopic,
  updateContent,
  deleteMainTopic,
  deleteSubTopic,
  executecode,
  uploadImageToContent,
  saveCorrectAnswer,
  checkUserAnswer,
  getAllTopicsWithUserProgress,
  updateUserProgress,
  getAllTopicsProgressAggregateController,
  reorderMainTopic,
  reorderSubTopic,
  resetUserDatabase,
} = require("../controllers/courseController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/topics", getAllMainTopics);
router.get("/topics/:id", getMainTopicById);
router.get("/subtopics/:id", getSubTopicById);
router.get("/contents/:id", getContentById);

router.post("/topics", createOrUpdateMainTopic);
router.put("/topics/:id", createOrUpdateMainTopic);

router.post("/topics/:M_topic_id/subtopics", createSubTopic);
router.put("/subtopics/:id", updateSubTopic);
router.put("/contents/:id", updateContent);

router.post(
  "/contents/:contentId/images",
  upload.array("images"),
  uploadImageToContent
);

router.delete("/topics/:id", deleteMainTopic);
router.delete("/subtopics/:id", deleteSubTopic);

router.post("/execute", executecode);

router.post("/answers", saveCorrectAnswer);
router.post("/contents/:contentId/check", checkUserAnswer);

router.get("/topics-with-progress", getAllTopicsWithUserProgress);
router.put("/progress/:contentId", updateUserProgress);

router.get("/topics-progress", getAllTopicsProgressAggregateController);

router.post("/maintopic/reorder", reorderMainTopic);
router.post("/subtopic/reorder", reorderSubTopic);

router.post("/user/reset-db", resetUserDatabase);

module.exports = router;
