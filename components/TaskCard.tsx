'use client';

import { Task } from '@/types/board';
import { Draggable } from 'react-beautiful-dnd';
import { Edit2, Trash2, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, index, onEdit, onDelete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-low';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div className={`priority-indicator ${getPriorityColor(task.priority)}`} />
          
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="task-action-btn"
                aria-label="Edit task"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="task-action-btn delete"
                aria-label="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-footer">
            <span className={`task-priority ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <div className="task-date">
              <Clock size={12} />
              <span>{task.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};