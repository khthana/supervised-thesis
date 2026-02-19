const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");
const User = require("./User");

const Posts = mainDb.define("Post", {
    Post_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Account_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "Account_ID",
        },
        onDelete: "CASCADE",
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Created_At: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

User.hasMany(Posts, { foreignKey: "Account_ID" });
Posts.belongsTo(User, { foreignKey: "Account_ID" });

module.exports = Posts;
