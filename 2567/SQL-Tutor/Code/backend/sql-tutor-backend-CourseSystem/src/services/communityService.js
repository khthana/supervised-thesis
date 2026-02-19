const fs = require("fs");
const path = require("path");
const Post = require("../models/Posts");
const Comment = require("../models/Comment");
const Reply = require("../models/Reply");
const { Sequelize } = require("sequelize");

const createPost = async (accountId, username, title, content, images = []) => {
    return await Post.create({
        Account_ID: accountId,
        Username: username,
        Title: title,
        Content: content,
        Image: JSON.stringify(images),
    });
};

const getAllPosts = async () => {
    const posts = await Post.findAll({
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM Comments AS comment
                        WHERE comment.Post_ID = Post.Post_ID
                    )`),
                    'commentCount'
                ],
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM Replies AS reply
                        WHERE reply.Comment_ID IN (
                            SELECT Comment_ID FROM Comments AS comment
                            WHERE comment.Post_ID = Post.Post_ID
                        )
                    )`),
                    'replyCount'
                ]
            ]
        }
    });
    return posts;
};

const getPostById = async (postId) => {
    const post = await Post.findByPk(postId, {
        include: [
            {
                model: Comment,
                as: "Comments",
                include: [
                    {
                        model: Reply,
                        as: "Replies",
                    },
                ],
            },
        ],
    });

    if (!post) {
        throw new Error("Post not found");
    }

    return post;
};

const uploadImageToPost = async (postId, newImages = [], existingImages = []) => {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post not found");

    const uploadDir = path.join(__dirname, "..", "imgPostContent");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const currentImages = post.Image ? JSON.parse(post.Image) : [];
    const existingImageSet = new Set(existingImages);

    const imagesToDelete = currentImages.filter(img => !existingImageSet.has(img));
    imagesToDelete.forEach(imageName => {
        const filePath = path.join(uploadDir, imageName);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Deleted image: ${imageName}`);
            } catch (error) {
                console.error(`Failed to delete image ${imageName}:`, error);
            }
        }
    });

    const newImageNames = newImages.map(image => image.filename);
    const updatedImageList = [...existingImages, ...newImageNames];

    post.Image = JSON.stringify([...new Set(updatedImageList)]);
    await post.save();

    return post;
};


const createComment = async (postId, accountId, username, content, images = []) => {
    return await Comment.create({
        Post_ID: postId,
        Account_ID: accountId,
        Username: username,
        Content: content,
        Image: JSON.stringify(images),
    });
};


const getCommentsByPost = async (postId) => {
    return await Comment.findAll({
        where: { Post_ID: postId },
        order: [["Created_At", "DESC"]],
    });
};

const markCommentAsHelpful = async (commentId, isHelpful) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    comment.Is_Helpful = isHelpful;
    await comment.save();

    return comment;
};

const uploadImageToComment = async (commentId, newImages = [], existingImages = []) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    const uploadDir = path.join(__dirname, "..", "imgCommentContent");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const currentImages = comment.Image ? JSON.parse(comment.Image) : [];
    const existingImageSet = new Set(existingImages);

    const imagesToDelete = currentImages.filter(img => !existingImageSet.has(img));
    imagesToDelete.forEach(imageName => {
        const filePath = path.join(uploadDir, imageName);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
                console.error(`Failed to delete image ${imageName}:`, error);
            }
        }
    });

    const newImageNames = newImages.map(image => image.filename);
    const updatedImageList = [...existingImages, ...newImageNames];

    comment.Image = JSON.stringify([...new Set(updatedImageList)]);
    await comment.save();

    return comment;
};

const createReply = async (commentId, parentReplyId, accountId, username, content, images = []) => {
    let commentOwnerName = "Unknown";

    if (parentReplyId) {
        const parentReply = await Reply.findByPk(parentReplyId);
        if (!parentReply) throw new Error("Parent Reply not found");
        commentOwnerName = parentReply.Username;
    } else {
        const comment = await Comment.findByPk(commentId);
        if (!comment) throw new Error("Comment not found");
        commentOwnerName = comment.Username;
    }

    return await Reply.create({
        Comment_ID: commentId,
        Parent_Reply_ID: parentReplyId || null,
        Account_ID: accountId,
        Username: username,
        Comment_Owner_Name: commentOwnerName,
        Content: content,
        Image: JSON.stringify(images),
    });
};

const getRepliesByComment = async (commentId) => {
    return await Reply.findAll({
        where: { Comment_ID: commentId, Parent_Reply_ID: null },
        include: [{ model: Reply, as: "Replies", required: false }],
        order: [["Created_At", "ASC"]],
    });
};

const getNestedReplies = async (parentReplyId) => {
    return await Reply.findAll({
        where: { Parent_Reply_ID: parentReplyId },
        order: [["Created_At", "ASC"]],
    });
};

const uploadImageToReply = async (replyId, newImages = [], existingImages = []) => {
    const reply = await Reply.findByPk(replyId);
    if (!reply) throw new Error("Reply not found");

    const uploadDir = path.join(__dirname, "..", "imgReplyContent");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const currentImages = reply.Image ? JSON.parse(reply.Image) : [];
    const existingImageSet = new Set(existingImages);

    const imagesToDelete = currentImages.filter(img => !existingImageSet.has(img));
    imagesToDelete.forEach(imageName => {
        const filePath = path.join(uploadDir, imageName);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Deleted image: ${imageName}`);
            } catch (error) {
                console.error(`Failed to delete image ${imageName}:`, error);
            }
        }
    });

    const newImageNames = newImages.map(image => image.filename);
    const updatedImageList = [...existingImages, ...newImageNames];

    reply.Image = JSON.stringify([...new Set(updatedImageList)]);
    await reply.save();

    return reply;
};

const updatePost = async (postId, updateData, newImages = [], existingImages = []) => {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post not found");
  
    if (updateData.title) post.Title = updateData.title;
    if (updateData.content) post.Content = updateData.content;

    if (newImages.length > 0 || existingImages.length > 0) {
      const uploadDir = path.join(__dirname, "..", "imgPostContent");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const currentImages = post.Image ? JSON.parse(post.Image) : [];
      const existingImageSet = new Set(existingImages);
      const imagesToDelete = currentImages.filter(img => !existingImageSet.has(img));
      imagesToDelete.forEach(imageName => {
        const filePath = path.join(uploadDir, imageName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted image: ${imageName}`);
          } catch (error) {
            console.error(`Failed to delete image ${imageName}:`, error);
          }
        }
      });
      const newImageNames = newImages.map(image => image.filename);
      const updatedImageList = [...existingImages, ...newImageNames];
      post.Image = JSON.stringify([...new Set(updatedImageList)]);
    }
    await post.save();
    return post;
  };

  const deletePost = async (postId) => {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post not found");

    const postUploadDir = path.join(__dirname, "..", "imgPostContent");
    const postImages = post.Image ? JSON.parse(post.Image) : [];
    postImages.forEach(imageName => {
      const filePath = path.join(postUploadDir, imageName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted post image: ${imageName}`);
        } catch (error) {
          console.error(`Failed to delete post image ${imageName}:`, error);
        }
      }
    });

    const comments = await Comment.findAll({ where: { Post_ID: postId } });
    for (const comment of comments) {
      const commentUploadDir = path.join(__dirname, "..", "imgCommentContent");
      const commentImages = comment.Image ? JSON.parse(comment.Image) : [];
      commentImages.forEach(imageName => {
        const filePath = path.join(commentUploadDir, imageName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted comment image: ${imageName}`);
          } catch (error) {
            console.error(`Failed to delete comment image ${imageName}:`, error);
          }
        }
      });

      const replies = await Reply.findAll({ where: { Comment_ID: comment.Comment_ID } });
      for (const reply of replies) {
        const replyUploadDir = path.join(__dirname, "..", "imgReplyContent");
        const replyImages = reply.Image ? JSON.parse(reply.Image) : [];
        replyImages.forEach(imageName => {
          const filePath = path.join(replyUploadDir, imageName);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted reply image: ${imageName}`);
            } catch (error) {
              console.error(`Failed to delete reply image ${imageName}:`, error);
            }
          }
        });
      }
    }

    await Post.destroy({ where: { Post_ID: postId } });
    return { message: "Post deleted successfully" };
  };

  const updateComment = async (commentId, updateData, newImages = [], existingImages = []) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");
  
    if (updateData.content) comment.Content = updateData.content;
  
    if (newImages.length > 0 || existingImages.length > 0) {
      const uploadDir = path.join(__dirname, "..", "imgCommentContent");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const currentImages = comment.Image ? JSON.parse(comment.Image) : [];
      const existingImageSet = new Set(existingImages);
      const imagesToDelete = currentImages.filter(img => !existingImageSet.has(img));
      imagesToDelete.forEach(imageName => {
        const filePath = path.join(uploadDir, imageName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.error(`Failed to delete comment image ${imageName}:`, error);
          }
        }
      });
      const newImageNames = newImages.map(image => image.filename);
      const updatedImageList = [...existingImages, ...newImageNames];
      comment.Image = JSON.stringify([...new Set(updatedImageList)]);
    }
    await comment.save();
    return comment;
  };

  const deleteComment = async (commentId) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    const commentUploadDir = path.join(__dirname, "..", "imgCommentContent");
    const commentImages = comment.Image ? JSON.parse(comment.Image) : [];
    commentImages.forEach(imageName => {
      const filePath = path.join(commentUploadDir, imageName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Failed to delete comment image ${imageName}:`, error);
        }
      }
    });

    const replies = await Reply.findAll({ where: { Comment_ID: commentId } });
    for (const reply of replies) {
      const replyUploadDir = path.join(__dirname, "..", "imgReplyContent");
      const replyImages = reply.Image ? JSON.parse(reply.Image) : [];
      replyImages.forEach(imageName => {
        const filePath = path.join(replyUploadDir, imageName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.error(`Failed to delete reply image ${imageName}:`, error);
          }
        }
      });
    }

    await Comment.destroy({ where: { Comment_ID: commentId } });
    return { message: "Comment deleted successfully" };
  };

  const updateReply = async (replyId, updateData, newImages = [], existingImages = []) => {
    const reply = await Reply.findByPk(replyId);
    if (!reply) throw new Error("Reply not found");
  
    if (updateData.content) reply.Content = updateData.content;
  
    if (newImages.length > 0 || existingImages.length > 0) {
      const uploadDir = path.join(__dirname, "..", "imgReplyContent");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const currentImages = reply.Image ? JSON.parse(reply.Image) : [];
      const existingImageSet = new Set(existingImages);
      const imagesToDelete = currentImages.filter(img => !existingImageSet.has(img));
      imagesToDelete.forEach(imageName => {
        const filePath = path.join(uploadDir, imageName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.error(`Failed to delete reply image ${imageName}:`, error);
          }
        }
      });
      const newImageNames = newImages.map(image => image.filename);
      const updatedImageList = [...existingImages, ...newImageNames];
      reply.Image = JSON.stringify([...new Set(updatedImageList)]);
    }
    await reply.save();
    return reply;
  };

  const deleteReply = async (replyId) => {
    const reply = await Reply.findByPk(replyId);
    if (!reply) throw new Error("Reply not found");
  
    const uploadDir = path.join(__dirname, "..", "imgReplyContent");
    const replyImages = reply.Image ? JSON.parse(reply.Image) : [];
    replyImages.forEach(imageName => {
      const filePath = path.join(uploadDir, imageName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Failed to delete reply image ${imageName}:`, error);
        }
      }
    });

    await Reply.destroy({ where: { Reply_ID: replyId } });
    return { message: "Reply deleted successfully" };
  };

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    uploadImageToPost,
    createComment,
    getCommentsByPost,
    markCommentAsHelpful,
    uploadImageToComment,
    createReply,
    getRepliesByComment,
    uploadImageToReply,
    getNestedReplies,
    updatePost, 
    deletePost,
    updateComment,
    deleteComment,
    updateReply,
    deleteReply
};
