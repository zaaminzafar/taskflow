const { Board } = require("../models");

// GET /api/boards — all boards belonging to the logged-in user
async function getBoards(req, res) {
  try {
    const boards = await Board.findAll({ where: { user_id: req.userId } });
    res.json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch boards" });
  }
}

// POST /api/boards — create a new board
async function createBoard(req, res) {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Board title is required" });
    }

    const board = await Board.create({ title, user_id: req.userId });
    res.status(201).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create board" });
  }
}

module.exports = { getBoards, createBoard };
