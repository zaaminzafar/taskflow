const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { getBoards, createBoard } = require("../controllers/boardController");
const { getTasksForBoard } = require("../controllers/taskController");

router.get("/", requireAuth, getBoards);
router.post("/", requireAuth, createBoard);
router.get("/:id/tasks", requireAuth, getTasksForBoard);

module.exports = router;
