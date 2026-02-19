const communityService = require("../services/communityService");

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const accountId = req.user.accountID;
        const username = req.user.username;

        const images = req.files ? req.files.map(file => file.filename) : [];

        const newPost = await communityService.createPost(accountId, username, title, content, images);
        res.status(200).json({ message: "โพสต์ถูกสร้างแล้ว", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
};


const getAllPosts = async (req, res) => {
    try {
        const posts = await communityService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await communityService.getPostById(id);

        if (!post) {
            return res.status(404).json({ message: "โพสต์ไม่พบ" });
        }

        let imagePaths = [];
        if (post.Image) {
            try {
                const imagesArray = JSON.parse(post.Image);
                imagePaths = imagesArray.map(filename => `/imgPostContent/${filename}`);
            } catch (error) {
                console.error(`Failed to parse images for post ID ${id}:`, error);
            }
        }

        const formattedComments = post.Comments.map(comment => {
            let commentImages = [];
            if (comment.Image) {
                try {
                    const commentImagesArray = JSON.parse(comment.Image);
                    commentImages = commentImagesArray.map(filename => `/imgCommentContent/${filename}`);
                } catch (error) {
                    console.error(`Failed to parse images for comment ID ${comment.Comment_ID}:`, error);
                }
            }

            const formattedReplies = comment.Replies.map(reply => {
                let replyImages = [];
                if (reply.Image) {
                    try {
                        const replyImagesArray = JSON.parse(reply.Image);
                        replyImages = replyImagesArray.map(filename => `/imgReplyContent/${filename}`);
                    } catch (error) {
                        console.error(`Failed to parse images for reply ID ${reply.Reply_ID}:`, error);
                    }
                }

                return {
                    ...reply.toJSON(),
                    Image: replyImages,
                };
            });

            return {
                ...comment.toJSON(),
                Image: commentImages,
                Replies: formattedReplies,
            };
        });

        res.status(200).json({
            ...post.toJSON(),
            Image: imagePaths,
            Comments: formattedComments,
        });
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
};

const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const accountId = req.user.accountID;
        const username = req.user.username;
        const images = req.files ? req.files.map(file => file.filename) : [];

        const newComment = await communityService.createComment(postId, accountId, username, content, images);
        res.status(201).json({ message: "คอมเมนต์ถูกสร้างแล้ว", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
};


const markCommentAsHelpful = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { isHelpful } = req.body;

        const updatedComment = await communityService.markCommentAsHelpful(commentId, isHelpful);
        res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
};

const createReply = async (req, res) => {
    try {
        const { commentId, parentReplyId, content } = req.body;
        const accountId = req.user.accountID;
        const username = req.user.username; // ✅ ดึง Username จาก JWT

        if (!username) {
            return res.status(400).json({ message: "❌ Username ไม่สามารถเป็นค่าว่างได้" });
        }

        const images = req.files ? req.files.map(file => file.filename) : [];

        const newReply = await communityService.createReply(commentId, parentReplyId, accountId, username, content, images);
        res.status(201).json({ message: "✅ Reply ถูกสร้างแล้ว", reply: newReply });
    } catch (error) {
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error: error.message });
    }
};

const getRepliesByComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const replies = await communityService.getRepliesByComment(commentId);
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error: error.message });
    }
};

const getNestedReplies = async (req, res) => {
    try {
        const { parentReplyId } = req.params;
        const replies = await communityService.getNestedReplies(parentReplyId);
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error: error.message });
    }
};

const uploadImageToReply = async (req, res) => {
    try {
        const { replyId } = req.params;

        if (!replyId) {
            return res.status(400).json({ message: "replyId is missing" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        const updatedReply = await communityService.uploadImageToReply(replyId, req.files);

        res.status(200).json({
            message: "Images uploaded successfully",
            reply: updatedReply,
        });
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updatePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const updateData = req.body;
      const newImages = req.files || [];
      const existingImages = req.body.existingImages || [];
      const post = await communityService.updatePost(postId, updateData, newImages, existingImages);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const deletePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const result = await communityService.deletePost(postId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const updateComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const updateData = req.body;
      const newImages = req.files || [];
      const existingImages = req.body.existingImages || [];
      const comment = await communityService.updateComment(commentId, updateData, newImages, existingImages);
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const deleteComment = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const result = await communityService.deleteComment(commentId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const updateReply = async (req, res) => {
    try {
      const replyId = req.params.replyId;
      const updateData = req.body;
      const newImages = req.files || [];
      const existingImages = req.body.existingImages || [];
      const reply = await communityService.updateReply(replyId, updateData, newImages, existingImages);
      res.status(200).json(reply);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const deleteReply = async (req, res) => {
    try {
      const replyId = req.params.replyId;
      const result = await communityService.deleteReply(replyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    createComment,
    markCommentAsHelpful,
    createReply,
    getRepliesByComment,
    uploadImageToReply,
    getNestedReplies,
    updatePost,
    deletePost,
    updateComment,
    deleteComment,
    updateReply,
    deleteReply,
};
