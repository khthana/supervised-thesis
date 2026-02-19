const MainTopic = require("../models/MainTopic");
const SubTopic = require("../models/SubTopic");
const Content = require("../models/Content");
const Answer = require("../models/Answer");
const Progress = require("../models/Progress");
const User = require("../models/User");

const path = require('path');
const fs = require('fs');

const { Op } = require("sequelize");
const { executeDb } = require("../database/connection");
const { QueryTypes } = require('sequelize');
const { Sequelize } = require("sequelize");

const sqlite3 = require('sqlite3').verbose();

const checkDuplicateMainTopic = async (M_topic_title, id = null) => {
  const whereClause = { M_topic_title };

  if (id) {
    whereClause.M_topic_id = { [Op.ne]: id };
  }

  const existingTopic = await MainTopic.findOne({ where: whereClause });
  return existingTopic !== null;
};

const checkDuplicateSubTopic = async (M_topic_id, S_topic_title, id = null) => {
  const whereClause = { M_topic_id, S_topic_title };

  if (id) {
    whereClause.S_topic_id = { [Op.ne]: id };
  }

  const existingSubTopic = await SubTopic.findOne({ where: whereClause });
  return existingSubTopic !== null;
};

const createOrUpdateMainTopic = async (M_topic_title, id, status) => {
  if (id) {
    const topic = await MainTopic.findByPk(id);
    if (!topic) throw new Error("Main Topic not found");

    topic.M_topic_title = M_topic_title;
    topic.status = status;
    return await topic.save();
  }

  const existing = await MainTopic.findOne({ where: { M_topic_title } });
  if (existing) throw new Error("Duplicate Main Topic");

  const maxOrder = await MainTopic.max("Order");
  const finalOrder = (maxOrder !== null ? maxOrder + 1 : 1);

  return await MainTopic.create({
    M_topic_title,
    status,
    Order: finalOrder,
  });
};

const createSubTopic = async (M_topic_id, S_topic_title, Type) => {
  const isDuplicate = await checkDuplicateSubTopic(M_topic_id, S_topic_title);
  if (isDuplicate) {
    throw new Error("Duplicate Subtopic");
  }

  const maxOrder = await SubTopic.max("Order", { where: { M_topic_id } });
  const newOrder = (maxOrder !== null ? maxOrder + 1 : 1);

  const newSubTopic = await SubTopic.create({
    M_topic_id,
    S_topic_title,
    Type,
    Order: newOrder,
  });

  const emptyContent = await Content.create({
    S_topic_id: newSubTopic.S_topic_id,
    Content_info: '',
    Content_type: Type,
    Content_img: null,
  });

  newSubTopic.dataValues.contents = [emptyContent];

  return newSubTopic;
};

const updateSubTopic = async (id, M_topic_id, S_topic_title) => {
  const isDuplicate = await checkDuplicateSubTopic(
    M_topic_id,
    S_topic_title,
    id,
  );
  if (isDuplicate) {
    throw new Error("Duplicate Subtopic");
  }

  const subTopic = await SubTopic.findByPk(id);
  if (!subTopic) {
    throw new Error("Subtopic not found");
  }

  subTopic.S_topic_title = S_topic_title;
  return await subTopic.save();
};

const updateContent = async (id, contentData) => {
  const existingContent = await Content.findByPk(id);
  if (!existingContent) {
    throw new Error("Content not found");
  }

  existingContent.Content_info = contentData.Content_info;
  existingContent.Content_type = contentData.Content_type;
  existingContent.Query_type = contentData.Query_type ?? null;

  return await existingContent.save();
};

const getAllMainTopics = async (Permission) => {
  console.log('Permission:', Permission);
  
  const mainTopics = await MainTopic.findAll({
    include: [
      {
        model: SubTopic,
        include: [Content],
      },
    ],
  });

  const transformedTopics = mainTopics.map(topic => {
    const topicJSON = topic.toJSON();
    topicJSON.SubTopics = topicJSON.SubTopics.map(subTopic => {
      return {
        ...subTopic,
        Contents: subTopic.Contents.map(content => {
          let imagePaths = null;

          if (content.Content_img) {
            try {
              const imagesArray = JSON.parse(content.Content_img);
              imagePaths = imagesArray.map(filename => `/imgSystemcontent/${filename}`);
            } catch (error) {
              console.error(`Failed to parse Content_img for content ID ${content.Content_id}:`, error);
              imagePaths = null;
            }
          }

          return {
            ...content,
            Content_img: imagePaths,
          };
        })
      };
    });
    return topicJSON;
  });

  if (Permission === "0") {
    return transformedTopics;
  }

  return transformedTopics.filter(topic => topic.status === 1);
};

const getMainTopicById = async (id) => {
  return await MainTopic.findByPk(id, {
    include: [
      {
        model: SubTopic,
        include: [Content],
      },
    ],
  });
};

const getSubTopicById = async (id) => {
  return await SubTopic.findByPk(id, {
    include: [Content],
  });
};

const getContentById = async (id) => {
  return await Content.findByPk(id);
};

const deleteMainTopic = async (id) => {
  try {
    const subTopics = await SubTopic.findAll({ where: { M_topic_id: id } });

    for (const subTopic of subTopics) {
      const contents = await Content.findAll({ where: { S_topic_id: subTopic.S_topic_id } });
      
      for (const content of contents) {
        const images = JSON.parse(content.Content_img || '[]');
        
        for (const image of images) {
          const imagePath = path.join(__dirname, '..', 'imgSystemcontent', image);
          
          try {
            if (fs.existsSync(imagePath)) {
              console.log(`Deleting file: ${imagePath}`);
              fs.unlinkSync(imagePath);
            } else {
              console.log(`File not found: ${imagePath}`);
            }
          } catch (fileError) {
            console.error(`Error removing file ${imagePath}:`, fileError);
          }
        }
      }

      const contentIds = contents.map(content => content.Content_id);
      await Answer.destroy({ where: { Content_id: contentIds } });
      await Progress.destroy({ where: { Content_id: contentIds } });

      await Content.destroy({ where: { S_topic_id: subTopic.S_topic_id } });
    }

    await SubTopic.destroy({ where: { M_topic_id: id } });

    const deletedMainTopic = await MainTopic.destroy({ where: { M_topic_id: id } });
    
    if (!deletedMainTopic) {
      throw new Error('Main topic not found');
    }

    return { message: 'Main topic deleted successfully' };
  } catch (error) {
    console.error('Error deleting main topic:', error);
    throw new Error(error.message);
  }
};

const deleteSubTopic = async (id) => {
  try {
    const subTopic = await SubTopic.findByPk(id);
    if (!subTopic) {
      return null;
    }

    const contents = await Content.findAll({ where: { S_topic_id: id } });
    const contentIds = contents.map(content => content.Content_id);

    for (const content of contents) {
      const imagePaths = JSON.parse(content.Content_img || '[]');
      
      imagePaths.forEach(imageName => {
        const filePath = path.join(__dirname, '..', 'imgSystemcontent', imageName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          } catch (err) {
            console.error(`Error deleting file ${filePath}:`, err);
          }
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      });
    }

    await Progress.destroy({ where: { Content_id: contentIds } });
    await Answer.destroy({ where: { Content_id: contentIds } });

    await Content.destroy({ where: { S_topic_id: id } });

    await subTopic.destroy();

    return true;
  } catch (error) {
    console.error('Error deleting subtopic:', error.message);
    throw new Error('Error deleting subtopic and related content');
  }
};

const removeAllImagesFromContent = async (contentId) => {
  const content = await Content.findByPk(contentId);
  if (!content) {
    throw new Error('Content not found');
  }

  const uploadDir = path.join(__dirname, '..', 'imgSystemcontent');

  const currentImages = content.Content_img ? JSON.parse(content.Content_img) : [];

  currentImages.forEach(imageName => {
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

  content.Content_img = JSON.stringify([]);
  await content.save();

  console.log(`Removed all images for content ID: ${contentId}`);
  return content;
};

const uploadImageToContent = async (contentId, newImages = [], existingImages = []) => {
  const content = await Content.findByPk(contentId);
  if (!content) {
    throw new Error('Content not found');
  }

  const uploadDir = path.join(__dirname, '..', 'imgSystemcontent');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const currentImages = content.Content_img ? JSON.parse(content.Content_img) : [];

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

  const finalImageList = [...new Set(updatedImageList)];

  content.Content_img = JSON.stringify(finalImageList);
  await content.save();

  console.log(`Updated images for content ID: ${contentId}`);
  return content;
};

const isRestrictedCommand = (sql) => {
  const lowerSQL = sql.toLowerCase();
  return restrictedDbCommands.some(cmd => lowerSQL.includes(cmd));
};

const isDqlAllowed = (sql) => {
  const firstWord = sql.trim().split(" ")[0].toLowerCase();
  return dqlAllowedCommands.includes(firstWord);
};

const getUserDbPath = (userId) => {
  const dbDir = path.join(__dirname, 'temp_dbs');
  if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
  }
  return path.join(dbDir, `dbUser_${userId}.db`);
};


const restrictedDbCommands = ["create database", "drop database" , "view"];
const dqlAllowedCommands = ["select", "explain"];
const sqlInitFilePath = path.join(__dirname, '../database/warehouseDB.sql');
const initializeUserDatabase = (dbPath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(sqlInitFilePath)) {
      console.error("ไม่พบไฟล์ warehouseDB.sql");
      return reject("SQL init file not found");
    }

    const sqlInitContent = fs.readFileSync(sqlInitFilePath, 'utf8');
    const cleanedSQL = sqlInitContent
      .split(";")
      .map(q => q.trim())
      .filter(q => q && !q.startsWith("--"))
      .join(";"); // รวมใหม่เป็น string เดียว

    const db = new sqlite3.Database(dbPath);
    db.exec(cleanedSQL, (err) => {
      db.close();
      if (err) {
        console.error("❌ Error loading SQL:", err.message);
        return reject(`SQL Init Error: ${err.message}`);
      }
      console.log(`✅ Database ${dbPath} โหลดข้อมูลเสร็จแล้ว`);
      resolve();
    });
  });
};

const ensureUserDbExists = async (userId) => {
  const dbPath = getUserDbPath(userId);
  if (!fs.existsSync(dbPath)) {
    console.log(`Creating new SQLite database for user ${userId}`);
    await initializeUserDatabase(dbPath);
  }
  return dbPath;
};

const executecode = async (sql, userId, queryType) => {
  if (isRestrictedCommand(sql)) {
      throw new Error("คำสั่ง CREATE DATABASE และ DROP DATABASE ไม่ได้รับอนุญาต");
  }

  if (queryType === "DQL") {
      if (!isDqlAllowed(sql)) {
          throw new Error("DQL อนุญาตเฉพาะคำสั่ง SELECT และ EXPLAIN เท่านั้น");
      }

      try {
          const queryType = sql.trim().toLowerCase().startsWith("explain") ? QueryTypes.RAW : QueryTypes.SELECT;
          const result = await executeDb.query(sql, { type: queryType });
          return { success: true, data: result };
      } catch (error) {
          console.error('Error executing SQL in main DB:', error);
          throw new Error(`Execution error: ${error.message}`);
      }
  } else {
      await ensureUserDbExists(userId);
      const dbPath = getUserDbPath(userId);
      const db = new sqlite3.Database(dbPath);

      return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
          db.close();
      
          if (err) {
            reject(new Error(`Execution error: ${err.message}`));
          } else {
            const isSelect = sql.trim().toLowerCase().startsWith("select");
            const data = Array.isArray(rows) ? rows : [];
      
            resolve({
              success: true,
              data,
              message: isSelect && data.length === 0
                ? "ℹ️ No rows found"
                : !isSelect
                  ? "✅ SQL executed successfully"
                  : null
            });
          }
        });
      });
  }
};

const saveAnswer = async (contentId, result) => {
  const existingAnswer = await Answer.findOne({ where: { Content_id: contentId } });
  if (existingAnswer) {
    existingAnswer.Ans_info = JSON.stringify(result);
    return await existingAnswer.save();
  } else {
    return await Answer.create({
      Content_id: contentId,
      Ans_info: JSON.stringify(result),
    });
  }
};

const checkAnswer = async (contentId, userResult) => {
  const correctAnswer = await Answer.findOne({ where: { Content_id: contentId } });
  if (!correctAnswer) {
      throw new Error("No answer found for this content");
  }

  const correctData = JSON.parse(correctAnswer.Ans_info);

  const resultComparison = compareResults(userResult, correctData);

  return resultComparison;
};

const compareResults = (userResult, correctData) => {
  if (JSON.stringify(userResult) === JSON.stringify(correctData)) {
      return { success: true, message: "คำตอบถูกต้อง" };
  }

  if (userResult.length !== correctData.length) {
      return { 
          success: false, 
          message: `จำนวนแถวไม่ตรงกัน (คุณส่ง ${userResult.length} แถว แต่คำตอบมี ${correctData.length} แถว)` 
      };
  }

  if (userResult.length > 0 && correctData.length > 0) {
      const userColumns = Object.keys(userResult[0]);
      const correctColumns = Object.keys(correctData[0]);

      if (JSON.stringify(userColumns) !== JSON.stringify(correctColumns)) {
          return { 
              success: false, 
              message: `ชื่อคอลัมน์ไม่ตรงกัน (คุณมี ${userColumns.join(", ")} แต่ควรเป็น ${correctColumns.join(", ")})` 
          };
      }
  }

  let errorMessages = [];
  userResult.forEach((userRow, rowIndex) => {
      const correctRow = correctData[rowIndex];

      Object.keys(correctRow).forEach((column) => {
          if (userRow[column] !== correctRow[column]) {
              errorMessages.push(`แถวที่ ${rowIndex + 1}, คอลัมน์ "${column}" ค่าของคุณคือ "${userRow[column]}" แต่ควรเป็น "${correctRow[column]}"`);
          }
      });
  });

  return { 
      success: false, 
      message: errorMessages.length > 0 ? errorMessages.join("\n") : "ค่าบางอย่างไม่ตรงกัน" 
  };
};

const initializeAllUserProgress = async (userId) => {
  const contents = await Content.findAll({
    include: [{ model: SubTopic, include: [MainTopic] }],
    order: [[Sequelize.literal('`SubTopic->MainTopic`.`Order`'), 'ASC'], ['S_topic_id', 'ASC']]
  });

  const existingProgress = await Progress.findAll({ where: { Account_id: userId } });
  const existingContentIds = new Set(existingProgress.map(p => p.Content_id));

  const progressToAdd = contents
    .filter(content => !existingContentIds.has(content.Content_id))
    .map(content => ({
      Account_id: userId,
      Content_id: content.Content_id,
      P_state: "lock"
    }));

  if (progressToAdd.length > 0) {
    await Progress.bulkCreate(progressToAdd);
  }

  const firstContent = contents[0];
  if (firstContent && !existingContentIds.has(firstContent.Content_id)) {
    await Progress.update(
      { P_state: "wait" },
      {
        where: {
          Account_id: userId,
          Content_id: firstContent.Content_id,
        },
      }
    );
  }
};

const unlockNextContent = async (userId, contentId) => {
  const currentContent = await Content.findOne({
    where: { Content_id: contentId },
    include: {
      model: SubTopic,
      include: [MainTopic],
    },
  });

  if (!currentContent || !currentContent.SubTopic || !currentContent.SubTopic.MainTopic) return;

  const currentSub = currentContent.SubTopic;
  const currentMain = currentSub.MainTopic;

  const allSubTopics = await SubTopic.findAll({
    where: { M_topic_id: currentMain.M_topic_id },
    order: [["Order", "ASC"]],
  });

  const allPassed = await Promise.all(
    allSubTopics.map(async (sub) => {
      const content = await Content.findOne({ where: { S_topic_id: sub.S_topic_id } });
      if (!content) return false;
      const progress = await Progress.findOne({
        where: { Account_id: userId, Content_id: content.Content_id },
      });
      return progress && progress.P_state === "pass";
    })
  );

  const unlockContent = async (content) => {
    const progress = await Progress.findOne({
      where: { Account_id: userId, Content_id: content.Content_id }
    });

    if (!progress) {
      await Progress.create({
        Account_id: userId,
        Content_id: content.Content_id,
        P_state: "wait"
      });
    } else if (progress.P_state === "lock") {
      await progress.update({ P_state: "wait" });
    }
  };

  if (allPassed.every(Boolean)) {
    const nextMain = await MainTopic.findOne({
      where: { Order: { [Op.gt]: currentMain.Order } },
      order: [["Order", "ASC"]],
    });

    if (nextMain) {
      const firstSub = await SubTopic.findOne({
        where: { M_topic_id: nextMain.M_topic_id },
        order: [["Order", "ASC"]],
      });
      if (firstSub) {
        const content = await Content.findOne({ where: { S_topic_id: firstSub.S_topic_id } });
        if (content) await unlockContent(content);
      }
    }
  } else {
    const nextSub = await SubTopic.findOne({
      where: {
        M_topic_id: currentMain.M_topic_id,
        Order: { [Op.gt]: currentSub.Order },
      },
      order: [["Order", "ASC"]],
    });

    if (nextSub) {
      const nextContent = await Content.findOne({ where: { S_topic_id: nextSub.S_topic_id } });
      if (nextContent) await unlockContent(nextContent);
    }
  }
};

const getUserProgressWithUnlocks = async (userId) => {
  await initializeAllUserProgress(userId);

  const progressData = await Progress.findAll({ where: { Account_id: userId } });
  const progressMap = new Map(progressData.map(item => [item.Content_id, item.P_state]));

  const allContents = await Content.findAll({
    include: {
      model: SubTopic,
      include: [MainTopic],
    },
  });

  const sortedContents = allContents.sort((a, b) => {
    const aMain = a.SubTopic.MainTopic.Order;
    const bMain = b.SubTopic.MainTopic.Order;
    if (aMain !== bMain) return aMain - bMain;
    return a.SubTopic.Order - b.SubTopic.Order;
  });

  const result = [];
  let unlocked = true;

  for (const content of sortedContents) {
    const contentId = content.Content_id;
    const state = progressMap.get(contentId);

    if (state === "pass") {
      result.push({ contentId, state: "pass" });
    } else if (state === "wait" && unlocked) {
      result.push({ contentId, state: "wait" });
      unlocked = false;
    } else {
      result.push({ contentId, state: "lock" });
    }
  }

  return result;
};


const updateProgress = async (userId, contentId, newState) => {
  const progress = await Progress.findOne({ where: { Account_id: userId, Content_id: contentId } });

  if (progress) {
    progress.P_state = newState;
    await progress.save();
  } else {
    await Progress.create({ Account_id: userId, Content_id: contentId, P_state: newState });
  }

  if (newState === "pass") {
    await unlockNextContent(userId, contentId);
  }
};

const getAllTopicsWithUserProgressAggregate = async () => {
  const mainTopics = await MainTopic.findAll({
    include: [{
      model: SubTopic,
      include: [Content]
    }]
  });

  const topicsWithAggregate = await Promise.all(mainTopics.map(async topic => {
    const topicJSON = topic.toJSON();
    const contentIDs = [];

    // === วน SubTopic เพื่อเก็บ Content_id ทั้งหมด และนับ userPassedCount ต่อ SubTopic ===
    if (topicJSON.SubTopics && topicJSON.SubTopics.length > 0) {
      for (const sub of topicJSON.SubTopics) {
        if (sub.Contents && sub.Contents.length > 0) {
          const contentId = sub.Contents[0].Content_id;
          contentIDs.push(contentId);

          // 👇 นับจำนวนผู้ใช้ที่ pass content นี้
          const count = await Progress.count({
            where: {
              Content_id: contentId,
              P_state: 'pass'
            }
          });

          // ใส่ค่าที่ได้เพิ่มเข้าไปใน subtopic
          sub.userPassedCount = count;
        } else {
          sub.userPassedCount = 0;
        }
      }
    }

    // === Aggregate ระดับ MainTopic ===
    if (contentIDs.length === 0) {
      topicJSON.userPassedCount = 0;
      return topicJSON;
    }

    const passedRecords = await Progress.findAll({
      where: {
        Content_id: contentIDs,
        P_state: 'pass'
      },
      attributes: [
        'Account_id',
        [Sequelize.fn('COUNT', Sequelize.col('Account_id')), 'passCount']
      ],
      group: ['Account_id'],
      having: Sequelize.literal(`COUNT(*) = ${contentIDs.length}`)
    });

    topicJSON.userPassedCount = passedRecords.length;
    return topicJSON;
  }));

  return topicsWithAggregate;
};
const reorderMainTopics = async ({ mainTopicId, sourceOrder, destinationOrder }) => {
  const mainTopics = await MainTopic.findAll({ order: [["Order", "ASC"]] });

  const ordered = mainTopics.map(mt => mt.toJSON());
  const moved = ordered.find(item => item.M_topic_id === mainTopicId);
  if (!moved) throw new Error("MainTopic not found");

  ordered.splice(sourceOrder, 1);
  ordered.splice(destinationOrder, 0, moved);

  for (let i = 0; i < ordered.length; i++) {
    await MainTopic.update({ Order: i + 1 }, { where: { M_topic_id: ordered[i].M_topic_id } });
  }

  await rebuildProgressForAllUsersPreservePass();
  return { success: true, message: "MainTopic reordered and progress updated" };
};

const reorderSubTopics = async ({ mainTopicId, subtopicId, sourceOrder, destinationOrder }) => {
  const subTopics = await SubTopic.findAll({
    where: { M_topic_id: mainTopicId },
    order: [['Order', 'ASC']],
  });

  const ordered = subTopics.map(st => st.toJSON());
  const moved = ordered.find(item => item.S_topic_id === subtopicId);
  if (!moved) throw new Error("SubTopic not found");

  ordered.splice(sourceOrder, 1);
  ordered.splice(destinationOrder, 0, moved);

  for (let i = 0; i < ordered.length; i++) {
    await SubTopic.update(
      { Order: i + 1 },
      { where: { S_topic_id: ordered[i].S_topic_id } }
    );
  }

  const users = await User.findAll();
  for (const user of users) {
    await rebuildProgressPreservePass(user.Account_id);
  }

  return { success: true, message: "Reordered successfully" };
};



const rebuildProgressPreservePass = async (userId) => {
  const existingProgress = await Progress.findAll({ where: { Account_id: userId } });
  const passedContentIds = new Set(
    existingProgress.filter(p => p.P_state === 'pass').map(p => p.Content_id)
  );

  const contents = await Content.findAll({
    include: [{ model: SubTopic, include: [MainTopic] }],
    order: [[Sequelize.literal('`SubTopic->MainTopic`.`Order`'), 'ASC'], ['S_topic_id', 'ASC']]
  });

  const newProgress = [];
  let unlockNext = true;

  for (const content of contents) {
    let state = "lock";
    if (passedContentIds.has(content.Content_id)) {
      state = "pass";
    } else if (unlockNext) {
      state = "wait";
      unlockNext = false;
    }
    newProgress.push({
      Account_id: userId,
      Content_id: content.Content_id,
      P_state: state
    });
  }

  await Sequelize.transaction(async (t) => {
    await Progress.destroy({ where: { Account_id: userId }, transaction: t });
    await Progress.bulkCreate(newProgress, { transaction: t });
  });
};

const rebuildProgressForAllUsersPreservePass = async () => {
  const users = await User.findAll();
  for (const user of users) {
    await rebuildProgressPreservePass(user.Account_id);
  }
};

const deleteOldUserDbs = (daysOld = 1) => {
  const dbDir = path.join(__dirname, 'temp_dbs');
  if (!fs.existsSync(dbDir)) return;

  const now = Date.now();
  const files = fs.readdirSync(dbDir);

  files.forEach(file => {
    if (file.startsWith('dbUser_') && file.endsWith('.db')) {
      const filePath = path.join(dbDir, file);
      const stats = fs.statSync(filePath);
      const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

      if (ageInDays > daysOld) {
        fs.unlinkSync(filePath);
        console.log(`🧹 ลบ DB: ${file} (อายุ ${Math.floor(ageInDays)} วัน)`);
      }
    }
  });
};

const resetUserDb = (userId) => {
  const dbPath = getUserDbPath(userId);
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log(`ลบ DB เก่าของผู้ใช้ ${userId}`);
  }

  initializeUserDatabase(dbPath);
  console.log(`สร้าง DB ใหม่ให้กับผู้ใช้ ${userId}`);
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
  checkDuplicateMainTopic,
  checkDuplicateSubTopic,
  deleteMainTopic,
  deleteSubTopic,
  executecode,
  uploadImageToContent,
  saveAnswer,
  checkAnswer,
  getUserProgressWithUnlocks,
  updateProgress,
  removeAllImagesFromContent,
  getAllTopicsWithUserProgressAggregate,
  reorderMainTopics,
  reorderSubTopics,
  deleteOldUserDbs,
  resetUserDb
};
