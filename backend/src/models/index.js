// This file connects the models together (defines relationships)
// and exports everything from one place so other files can just do:
// const { User, Board, Task, sequelize } = require("../models");

const sequelize = require("../config/db");
const User = require("./User");
const Board = require("./Board");
const Task = require("./Task");

// A user can have many boards
User.hasMany(Board, { foreignKey: "user_id" });
Board.belongsTo(User, { foreignKey: "user_id" });

// A board can have many tasks
Board.hasMany(Task, { foreignKey: "board_id" });
Task.belongsTo(Board, { foreignKey: "board_id" });

module.exports = { sequelize, User, Board, Task };
