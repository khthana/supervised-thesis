const express = require("express");
const communityController = require("../controllers/communityController");
const authenticateToken = require("../middlewares/authMiddleware");
const { uploadPostImages, uploadCommentImages, uploadReplyImages } = require("../middlewares/uploadMiddleware");

const router = express.Router();


router.post("/create", authenticateToken, uploadPostImages.array("images"), communityController.createPost);
router.get("/all", communityController.getAllPosts);
router.get("/post/:id", communityController.getPostById);
router.put("/post/:id", authenticateToken, uploadPostImages.array("images"), communityController.updatePost);
router.delete("/post/:id", authenticateToken, communityController.deletePost);

router.post("/comment", authenticateToken, uploadCommentImages.array("images"), communityController.createComment);
router.put("/comment/:commentId/helpful", authenticateToken, communityController.markCommentAsHelpful);
router.put("/comment/:commentId", authenticateToken, uploadCommentImages.array("images"), communityController.updateComment);
router.delete("/comment/:commentId", authenticateToken, communityController.deleteComment);


router.post("/reply", authenticateToken, uploadReplyImages.array("images"), communityController.createReply);
router.get("/reply/:commentId", communityController.getRepliesByComment);
router.get("/reply/nested/:parentReplyId", communityController.getNestedReplies)
router.put("/reply/:replyId", authenticateToken, uploadReplyImages.array("images"), communityController.updateReply);
router.delete("/reply/:replyId", authenticateToken, communityController.deleteReply);

module.exports = router;
