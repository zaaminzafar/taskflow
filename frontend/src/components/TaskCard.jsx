import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index, onDelete, onClick }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? "dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
        >
          <div className="task-card-header">
            <h4>{task.title}</h4>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // don't trigger onClick(task) when deleting
                onDelete(task.id);
              }}
            >
              ×
            </button>
          </div>
          {task.description && <p className="task-description">{task.description}</p>}
          {task.due_date && <span className="task-due-date">Due: {task.due_date}</span>}
        </div>
      )}
    </Draggable>
  );
}
