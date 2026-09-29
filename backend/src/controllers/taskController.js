const { Task, Board } = require("../models");

// Small helper: confirms the board belongs to the logged-in user
// before letting them read/write its tasks.
async function verifyBoardOwnership(boardId, userId) {
  const board = await Board.findOne({ where: { id: boardId, user_id: userId } });
  return board; // null if not found / not owned by this user
}

// GET /api/boards/:id/tasks
async function getTasksForBoard(req, res) {
  try {
    const boardId = req.params.id;

    const board = await verifyBoardOwnership(boardId, req.userId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const tasks = await Task.findAll({
      where: { board_id: boardId },
      order: [["position", "ASC"]],
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
}

// POST /api/tasks
async function createTask(req, res) {
  try {
    const { board_id, title, description, due_date } = req.body;

    if (!board_id || !title) {
      return res.status(400).json({ message: "board_id and title are required" });
    }

    const board = await verifyBoardOwnership(board_id, req.userId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const task = await Task.create({ board_id, title, description, due_date });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
}

// PUT /api/tasks/:id — update title/description/due_date
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, due_date } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = await verifyBoardOwnership(task.board_id, req.userId);
    if (!board) {
      return res.status(403).json({ message: "Not authorized to edit this task" });
    }

    await task.update({ title, description, due_date });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
}

// PATCH /api/tasks/:id/status — called when a card is dragged to a new column
async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, position } = req.body;

    const validStatuses = ["todo", "in_progress", "done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = await verifyBoardOwnership(task.board_id, req.userId);
    if (!board) {
      return res.status(403).json({ message: "Not authorized to edit this task" });
    }

    await task.update({ status, position: position ?? task.position });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task status" });
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = await verifyBoardOwnership(task.board_id, req.userId);
    if (!board) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
}

module.exports = {
  getTasksForBoard,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
