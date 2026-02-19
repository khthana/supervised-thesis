const { DataTypes } = require("sequelize");
const { mainDb } = require("../database/connection");
const User = require("./User");
const Posts = require("./Posts");

const Comments = mainDb.define("Comment", {
    Comment_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Post_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Posts,
            key: "Post_ID",
        },
        onDelete: "CASCADE",
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
    Username: { // ✅ เพิ่มการเก็บ Username
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
    Is_Helpful: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    Created_At: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

User.hasMany(Comments, { foreignKey: "Account_ID" });
Comments.belongsTo(User, { foreignKey: "Account_ID" });

Posts.hasMany(Comments, { foreignKey: "Post_ID" });
Comments.belongsTo(Posts, { foreignKey: "Post_ID" });

module.exports = Comments;
