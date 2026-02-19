const courseService = require("../services/courseService");

// สร้างหรือแก้ไข Main topic
const createOrUpdateMainTopic = async (req, res) => {
  const { id } = req.params;
  const { M_topic_title, status } = req.body;

  try {
    const updatedOrNewTopic = await courseService.createOrUpdateMainTopic(
      M_topic_title,
      id,
      status
    );
    res.status(200).json(updatedOrNewTopic);
  } catch (error) {
    if (error.message === "Duplicate Main Topic") {
      return res.status(400).json({ message: "Main topic already exists" });
    }
    if (error.message === "Main Topic not found") {
      return res.status(404).json({ message: "Main topic not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//สร้าง Subtopic พร้อมกับ Content
const createSubTopic = async (req, res) => {
  const { M_topic_id, S_topic_title, Type } = req.body;

  try {
    const newSubTopic = await courseService.createSubTopic(
      M_topic_id,
      S_topic_title,
      Type
    );
    res.status(200).json(newSubTopic);
  } catch (error) {
    if (error.message === "Duplicate Subtopic") {
      return res.status(400).json({ message: "Subtopic already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// สำหรับแก้ไข Subtopic
const updateSubTopic = async (req, res) => {
  const { id } = req.params;
  const { M_topic_id, S_topic_title } = req.body;

  try {
    const updatedSubTopic = await courseService.updateSubTopic(
      id,
      M_topic_id,
      S_topic_title
    );
    res.status(200).json(updatedSubTopic);
  } catch (error) {
    if (error.message === "Duplicate Subtopic") {
      return res.status(400).json({ message: "Subtopic already exists" });
    }
    if (error.message === "Subtopic not found") {
      return res.status(404).json({ message: "Subtopic not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// สำหรับแก้ไข Content
const updateContent = async (req, res) => {
  const { id } = req.params;
  const { Content_info, Content_type, Query_type } = req.body;

  try {
    const updatedContent = await courseService.updateContent(id, {
      Content_info,
      Content_type,
      Query_type,
    });
    res.status(200).json(updatedContent);
  } catch (error) {
    if (error.message === "Content not found") {
      return res.status(404).json({ message: "Content not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ดึงข้อมูล Main topic ทั้งหมด
const getAllMainTopics = async (req, res) => {
  const Permission = req.headers.permission;
  try {
    const mainTopics = await courseService.getAllMainTopics(Permission);

    const sanitizedMainTopics = mainTopics.map((topic) => {
      const topicData = JSON.parse(JSON.stringify(topic));
      topicData.SubTopics = topicData.SubTopics.map((subTopic) => ({
        ...subTopic,
        Contents: subTopic.Contents.map((content) => ({
          ...content,
          Content_img: content.Content_img
            ? content.Content_img
            : "[Image path not available]",
        })),
      }));
      return topicData;
    });

    console.log("----------------------------------------");
    console.log(JSON.stringify(sanitizedMainTopics, null, 2));
    console.log("----------------------------------------");

    res.status(200).json(mainTopics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ดึงข้อมูล Main topic ตาม ID
const getMainTopicById = async (req, res) => {
  const { id } = req.params;
  try {
    const mainTopic = await courseService.getMainTopicById(id);

    // ซ่อนข้อมูล Content_img ใน mainTopic ด้วย "[Image data hidden]"
    const sanitizedMainTopic = { ...mainTopic.toJSON() };
    sanitizedMainTopic.SubTopics = sanitizedMainTopic.SubTopics.map(
      (subTopic) => ({
        ...subTopic,
        Contents: subTopic.Contents.map((content) => ({
          ...content,
          Content_img: "[Image data hidden]",
        })),
      })
    );

    console.log("----------------------------------------");
    console.log(
      "Main Topic Data:",
      JSON.stringify(sanitizedMainTopic, null, 2)
    );
    console.log("----------------------------------------");

    if (!mainTopic) {
      return res.status(404).json({ message: "Main topic not found" });
    }
    res.status(200).json(mainTopic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ดึงข้อมูล Subtopic ตาม ID
const getSubTopicById = async (req, res) => {
  const { id } = req.params;
  try {
    const subTopic = await courseService.getSubTopicById(id);

    // ซ่อนข้อมูล Content_img ใน subTopic ด้วย "[Image data hidden]"
    const sanitizedSubTopic = { ...subTopic.toJSON() };
    sanitizedSubTopic.Contents = sanitizedSubTopic.Contents.map((content) => ({
      ...content,
      Content_img: "[Image data hidden]",
    }));

    console.log("----------------------------------------");
    console.log("Subtopic Data:", JSON.stringify(sanitizedSubTopic, null, 2));
    console.log("----------------------------------------");

    if (!subTopic) {
      return res.status(404).json({ message: "Subtopic not found" });
    }
    res.status(200).json(subTopic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ดึงข้อมูล Content ตาม ID
const getContentById = async (req, res) => {
  const { id } = req.params;
  try {
    const content = await courseService.getContentById(id);

    // ซ่อนข้อมูล Content_img ใน content ด้วย "[Image data hidden]"
    const sanitizedContent = {
      ...content.toJSON(),
      Content_img: "[Image data hidden]",
    };

    console.log("----------------------------------------");
    console.log("Content Data:", JSON.stringify(sanitizedContent, null, 2));
    console.log("----------------------------------------");

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ลบ Main topic
const deleteMainTopic = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await courseService.deleteMainTopic(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteSubTopic = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await courseService.deleteSubTopic(id);
    if (!result) {
      return res.status(404).json({ message: "Subtopic not found" });
    }
    res
      .status(200)
      .json({ message: "Subtopic and related content deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const uploadImageToContent = async (req, res) => {
  const { contentId } = req.params;

  if (!contentId) {
    return res.status(400).json({ message: "❌ contentId is missing" });
  }

  try {
    console.log("🔹 Uploaded Files:", req.files); // ✅ Debug

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const updatedContent = await courseService.uploadImageToContent(
      contentId,
      req.files
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      content: updatedContent,
    });
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const executecode = async (req, res) => {
  const { code, userId , queryType,  } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "ไม่พบข้อมูลผู้ใช้" });
  }

  if (!code || code.trim() === "") {
    return res.status(400).json({ success: false, message: "SQL code ห้ามว่าง" });
  }

  try {
    const result = await courseService.executecode(code, userId, queryType);
    return res.status(200).json(result);
  } catch (error) {
    const message = error.message || "เกิดข้อผิดพลาดขณะรัน SQL";
    const isSyntaxError = message.toLowerCase().includes("syntax");
    const statusCode = isSyntaxError ? 422 : 400;

    console.error("❌ SQL Execution Error:", message);
    return res.status(statusCode).json({ success: false, message });
  }
};

const saveCorrectAnswer = async (req, res) => {
  const { contentId, result } = req.body;

  try {
    const savedAnswer = await courseService.saveAnswer(contentId, result);
    res.status(200).json({ success: true, data: savedAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving answer" });
  }
};

const checkUserAnswer = async (req, res) => {
  const { contentId } = req.params;
  const { userResult } = req.body;

  try {
      const resultComparison = await courseService.checkAnswer(contentId, userResult);
      res.status(200).json(resultComparison);
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTopicsWithUserProgress = async (req, res) => {
  try {
    const mainTopics = await courseService.getAllMainTopics(
      req.headers.permission
    );
    const userProgress = await courseService.getUserProgressWithUnlocks(
      req.headers.userid
    );

    const progressMap = new Map(
      userProgress.map((item) => [item.contentId, item.state])
    );

    const enrichedMainTopics = mainTopics.map((topic) => ({
      ...topic,
      SubTopics: topic.SubTopics.map((subTopic) => ({
        ...subTopic,
        Contents: subTopic.Contents.map((content) => ({
          ...content,
          state: progressMap.get(content.Content_id) || "locked",
        })),
      })),
    }));

    res.status(200).json({ success: true, data: enrichedMainTopics });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve topics with progress",
    });
  }
};

const updateUserProgress = async (req, res) => {
  const { contentId } = req.params;
  const { newState, userId } = req.body;

  try {
    await courseService.updateProgress(userId, contentId, newState);
    res
      .status(200)
      .json({ success: true, message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update progress" });
  }
};

const getAllTopicsProgressAggregateController = async (req, res) => {
  try {
    const topics = await courseService.getAllTopicsWithUserProgressAggregate();
    return res.status(200).json(topics);
  } catch (error) {
    console.error("Error in getAllTopicsProgressAggregateController:", error);
    return res.status(500).json({ message: error.message });
  }
};

const reorderMainTopic = async (req, res) => {
  try {
    const result = await courseService.reorderMainTopics(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Reorder MainTopic Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const reorderSubTopic = async (req, res) => {
  try {
    const result = await courseService.reorderSubTopics(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Reorder Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetUserDatabase = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }

  try {
    courseService.resetUserDb(userId);
    res.status(200).json({ success: true, message: `รีเซ็ตฐานข้อมูลของผู้ใช้ ${userId} แล้ว` });
  } catch (error) {
    console.error("Reset DB Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
  resetUserDatabase
};
