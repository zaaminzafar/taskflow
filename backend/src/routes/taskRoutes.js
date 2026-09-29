const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", requireAuth, createTask);
router.put("/:id", requireAuth, updateTask);
router.patch("/:id/status", requireAuth, updateTaskStatus);
router.delete("/:id", requireAuth, deleteTask);

module.exports = router;
