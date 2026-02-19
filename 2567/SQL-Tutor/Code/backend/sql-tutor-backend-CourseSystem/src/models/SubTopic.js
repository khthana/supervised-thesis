const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");
const MainTopic = require("./MainTopic");

const SubTopic = mainDb.define(
  "SubTopic",
  {
    S_topic_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    S_topic_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    M_topic_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: MainTopic,
        key: "M_topic_id",
      },
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Sub_topic",
    timestamps: false,
  },
);

MainTopic.hasMany(SubTopic, { foreignKey: "M_topic_id" });
SubTopic.belongsTo(MainTopic, { foreignKey: "M_topic_id" });

module.exports = SubTopic;
