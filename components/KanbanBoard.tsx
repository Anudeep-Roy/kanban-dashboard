'use client';

import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Column } from './Column';
import { TaskModal } from './TaskModal';
import { BoardModal } from './BoardModal';
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';
import { EmptyBoard } from './EmptyBoard';
import { useTasks } from '@/hooks/useTasks';
import { useBoards } from '@/hooks/useBoards';
import { Task } from '@/types/board';
import { Loader2, Plus, MoreHorizontal, LayoutDashboard } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const KanbanBoard = () => {
  const { boards, loading: boardsLoading, addBoard, updateBoard, deleteBoard } = useBoards();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(currentBoardId || undefined);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<Task['status']>('todo');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set the first board as current when boards are loaded
  useEffect(() => {
    if (boards.length > 0 && !currentBoardId) {
      setCurrentBoardId(boards[0].id);
    }
  }, [boards, currentBoardId]);

  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter(task => task.status === 'todo'),
      'in-progress': tasks.filter(task => task.status === 'in-progress'),
      done: tasks.filter(task => task.status === 'done'),
    };
  }, [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task['status'];
    updateTask(draggableId, { status: newStatus });
  };

  const handleAddTask = (status: Task['status']) => {
    setDefaultStatus(status);
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleBoardChange = (boardId: string) => {
    setCurrentBoardId(boardId);
  };

  const handleCreateBoard = () => {
    setIsBoardModalOpen(true);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (boards.length <= 1) return; // Don't delete the last board
    
    try {
      await deleteBoard(boardId);
      // If we're deleting the current board, switch to another one
      if (boardId === currentBoardId) {
        const remainingBoards = boards.filter(b => b.id !== boardId);
        if (remainingBoards.length > 0) {
          setCurrentBoardId(remainingBoards[0].id);
        }
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleSaveBoard = async (boardData: any) => {
    try {
      const newBoardId = await addBoard(boardData);
      setCurrentBoardId(newBoardId);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleAddColumn = () => {
    // For now, just show the modal to add a task
    handleAddTask('todo');
  };

  const getCurrentBoard = () => {
    return boards.find(board => board.id === currentBoardId);
  };

  const handleAddTaskFromHeader = () => {
    if (!currentBoardId) return;
    handleAddTask('todo');
  };

  if (boardsLoading) {
    return (
      <div className="app-layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <LayoutDashboard className="logo-icon" size={24} />
              <span className="logo-text">kanban</span>
            </div>
          </div>
        </div>
        <div className="main-content">
          <div className="loading-container">
            <Loader2 className="loading-spinner" size={32} />
            <p>Loading boards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar 
        boards={boards}
        currentBoard={currentBoardId}
        onBoardChange={handleBoardChange}
        onCreateBoard={handleCreateBoard}
        onDeleteBoard={handleDeleteBoard}
      />
      
      <div className="main-content">
        <header className="board-header">
          <div className="header-content">
            <h1 className="board-title">
              {getCurrentBoard()?.name || 'Select a Board'}
            </h1>
            <div className="header-actions">
              <button 
                onClick={handleAddTaskFromHeader}
                className="add-task-btn primary"
                disabled={!currentBoardId}
              >
                <Plus size={16} />
                Add New Task
              </button>
              <button className="menu-btn">
                <MoreHorizontal size={20} />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="board-container">
          {!currentBoardId ? (
            <div className="empty-board">
              <div className="empty-content">
                <p className="empty-message">
                  No boards available. Create your first board to get started.
                </p>
                <button onClick={handleCreateBoard} className="add-column-btn">
                  <Plus size={16} />
                  Create New Board
                </button>
              </div>
            </div>
          ) : tasksLoading ? (
            <div className="loading-container">
              <Loader2 className="loading-spinner" size={32} />
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <EmptyBoard onAddColumn={handleAddColumn} />
          ) : mounted ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="board-columns">
                {COLUMNS.map((column) => (
                  <Column
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    tasks={tasksByStatus[column.id as keyof typeof tasksByStatus]}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={deleteTask}
                  />
                ))}
              </div>
            </DragDropContext>
          ) : (
            <div className="board-columns">
              {COLUMNS.map((column) => (
                <div key={column.id} className="column">
                  <div className="column-header">
                    <h3 className="column-title">{column.title}</h3>
                  </div>
                  <div className="column-content">
                    {tasksByStatus[column.id as keyof typeof tasksByStatus].map((task) => (
                      <div key={task.id} className="task-card">
                        <h4>{task.title}</h4>
                        {task.description && <p>{task.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={addTask}
        onUpdate={updateTask}
        task={editingTask}
        defaultStatus={defaultStatus}
        boardId={currentBoardId || ''}
      />

      <BoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        onSave={handleSaveBoard}
        onUpdate={updateBoard}
      />
    </div>
  );
};