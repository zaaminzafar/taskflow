import api from "./axiosConfig";

export async function getBoards() {
  const res = await api.get("/boards");
  return res.data;
}

export async function createBoard(title) {
  const res = await api.post("/boards", { title });
  return res.data;
}

export async function getTasksForBoard(boardId) {
  const res = await api.get(`/boards/${boardId}/tasks`);
  return res.data;
}

export async function createTask(boardId, title, description, dueDate) {
  const res = await api.post("/tasks", {
    board_id: boardId,
    title,
    description,
    due_date: dueDate,
  });
  return res.data;
}

export async function updateTaskStatus(taskId, status, position) {
  const res = await api.patch(`/tasks/${taskId}/status`, { status, position });
  return res.data;
}

export async function deleteTask(taskId) {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
}
