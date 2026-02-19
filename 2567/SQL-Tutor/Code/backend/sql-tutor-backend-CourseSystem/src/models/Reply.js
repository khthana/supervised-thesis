const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");
const Comment = require("./Comment");
const User = require("./User");

const Replies = mainDb.define("Reply", {
    Reply_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Parent_Reply_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "Replies",
            key: "Reply_ID",
        },
        onDelete: "CASCADE",
    },
    Comment_ID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Comment,
            key: "Comment_ID",
        },
        onDelete: "CASCADE",
    },
    Account_ID: {
        type: DataTypes.INTEGER.UNSIGNED,
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
    Comment_Owner_Name: {
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

Comment.hasMany(Replies, { foreignKey: "Comment_ID" });
Replies.belongsTo(Comment, { foreignKey: "Comment_ID" });

User.hasMany(Replies, { foreignKey: "Account_ID" });
Replies.belongsTo(User, { foreignKey: "Account_ID" });

Replies.hasMany(Replies, { as: "Replies", foreignKey: "Parent_Reply_ID" });
Replies.belongsTo(Replies, { as: "ParentReply", foreignKey: "Parent_Reply_ID" });

module.exports = Replies;
