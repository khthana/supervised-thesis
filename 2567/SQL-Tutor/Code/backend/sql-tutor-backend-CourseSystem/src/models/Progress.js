const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");
const User = require("./User");
const Content = require("./Content");

const Progress = mainDb.define("Progress", {
  Progress_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  Account_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: "Account_ID",
    },
  },
  Content_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    references: {
      model: Content,
      key: "Content_id",
    },
  },
  P_state: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: "Progress",
  timestamps: false,
});

// กำหนดความสัมพันธ์
User.hasMany(Progress, { foreignKey: "Account_id" });
Progress.belongsTo(User, { foreignKey: "Account_id" });

Content.hasMany(Progress, { foreignKey: "Content_id" });
Progress.belongsTo(Content, { foreignKey: "Content_id" });

module.exports = Progress;
