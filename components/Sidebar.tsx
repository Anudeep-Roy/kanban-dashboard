'use client';

import { useState } from 'react';
import { Plus, LayoutDashboard, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Board } from '@/types/board';

interface SidebarProps {
  boards: Board[];
  currentBoard: string | null;
  onBoardChange: (boardId: string) => void;
  onCreateBoard: () => void;
  onDeleteBoard: (boardId: string) => void;
}

export const Sidebar = ({ 
  boards, 
  currentBoard, 
  onBoardChange, 
  onCreateBoard, 
  onDeleteBoard 
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <LayoutDashboard className="logo-icon" size={24} />
          {!isCollapsed && <span className="logo-text">kanban</span>}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="sidebar-section">
            <h3 className="section-title">ALL BOARDS ({boards?.length || 0})</h3>
            <div className="boards-list">
              {boards?.map((board) => (
                <div
                  key={board.id}
                  className={`board-item ${board.id === currentBoard ? 'active' : ''}`}
                >
                  <button
                    onClick={() => onBoardChange(board.id)}
                    className="board-button"
                  >
                    <LayoutDashboard size={16} />
                    <span>{board.name}</span>
                  </button>
                  {boards.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBoard(board.id);
                      }}
                      className="delete-board-btn"
                      aria-label="Delete board"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={onCreateBoard} className="board-item create-board">
                <Plus size={16} />
                <span>+ Create New Board</span>
              </button>
            </div>
          </div>
        </>
      )}

      <div className="sidebar-footer">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="collapse-btn"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!isCollapsed && <span>Hide Sidebar</span>}
        </button>
      </div>
    </div>
  );
};