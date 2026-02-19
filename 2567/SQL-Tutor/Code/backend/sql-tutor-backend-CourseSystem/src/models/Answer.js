const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");
const Content = require("./Content");

const Answer = mainDb.define("Answer", {
  Ans_id: {
    type: DataTypes.INTEGER(10),
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  Ans_info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Content_id: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
    references: {
      model: Content,
      key: "Content_id",
    },
    unique: true,
  },
}, {
  tableName: "Answer",
  timestamps: false,
});

Content.hasOne(Answer, { foreignKey: "Content_id" });
Answer.belongsTo(Content, { foreignKey: "Content_id" });

module.exports = Answer;