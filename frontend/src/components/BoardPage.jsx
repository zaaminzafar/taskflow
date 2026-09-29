import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import TaskModal from "./TaskModal";
import {
  getBoards,
  createBoard,
  getTasksForBoard,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../api/taskApi";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function BoardPage({ user, onLogout }) {
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // On first load: get (or create) the user's board, then load its tasks
  useEffect(() => {
    async function init() {
      try {
        const boards = await getBoards();
        let activeBoard = boards[0];

        if (!activeBoard) {
          activeBoard = await createBoard("My Tasks");
        }
        setBoard(activeBoard);

        const boardTasks = await getTasksForBoard(activeBoard.id);
        setTasks(boardTasks);
      } catch (err) {
        console.error("Failed to initialize board:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function tasksByStatus(status) {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);
  }

  async function handleCreateTask({ title, description, dueDate }) {
    try {
      const newTask = await createTask(board.id, title, description, dueDate || null);
      setTasks((prev) => [...prev, newTask]);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }

  // Called by react-beautiful-dnd whenever a drag gesture ends
  async function handleDragEnd(result) {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid column, or dropped back in the same spot
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId;
    const newPosition = destination.index;

    // Update the UI immediately (optimistic update), then sync with the backend
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, position: newPosition } : t
      )
    );

    try {
      await updateTaskStatus(taskId, newStatus, newPosition);
    } catch (err) {
      console.error("Failed to update task status:", err);
      // In a more advanced version, you'd roll back the optimistic update here
    }
  }

  if (loading) return <p className="loading-text">Loading your board...</p>;

  return (
    <div className="board-page">
      <header className="board-header">
        <h1>{board?.title || "My Board"}</h1>
        <div>
          <span className="welcome-text">Hi, {user.name}</span>
          <button onClick={() => setShowModal(true)}>+ New Task</button>
          <button className="logout-button" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-columns">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              title={col.title}
              tasks={tasksByStatus(col.id)}
              onDelete={handleDeleteTask}
              onCardClick={() => {}}
            />
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal onClose={() => setShowModal(false)} onCreate={handleCreateTask} />
      )}
    </div>
  );
}
