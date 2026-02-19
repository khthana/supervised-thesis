const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");

const MainTopic = mainDb.define(
  "MainTopic",
  {
    M_topic_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    M_topic_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Main_topic",
    timestamps: false,
  }
);

module.exports = MainTopic;
