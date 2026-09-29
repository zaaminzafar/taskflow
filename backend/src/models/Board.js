const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Board = sequelize.define("Board", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "boards",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

module.exports = Board;
