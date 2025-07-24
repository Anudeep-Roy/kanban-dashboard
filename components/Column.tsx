'use client';

import { Task } from '@/types/board';
import { Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: (status: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Column = ({ 
  id, 
  title, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}: ColumnProps) => {
  return (
    <div className="column">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="task-count">{tasks.length}</span>
        <button
          onClick={() => onAddTask(id as Task['status'])}
          className="add-task-btn"
          aria-label={`Add task to ${title}`}
        >
          <Plus size={16} />
        </button>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-content ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};