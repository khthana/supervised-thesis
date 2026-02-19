const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");
const SubTopic = require("./SubTopic");

const Content = mainDb.define(
  "Content",
  {
    Content_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Content_info: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Content_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    Content_img: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Query_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    S_topic_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: SubTopic,
        key: "S_topic_id",
      },
    },
  },
  {
    tableName: "Content",
    timestamps: false,
  },
);

SubTopic.hasMany(Content, { foreignKey: "S_topic_id" });
Content.belongsTo(SubTopic, { foreignKey: "S_topic_id" });

module.exports = Content;
