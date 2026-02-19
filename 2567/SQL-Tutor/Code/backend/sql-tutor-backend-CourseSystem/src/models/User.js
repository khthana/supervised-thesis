const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");

const User = mainDb.define(
  "accounts",
  {
    Account_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Permission: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = User;
