'use client';

import { Plus } from 'lucide-react';

interface EmptyBoardProps {
  onAddColumn: () => void;
}

export const EmptyBoard = ({ onAddColumn }: EmptyBoardProps) => {
  return (
    <div className="empty-board">
      <div className="empty-content">
        <p className="empty-message">
          This board is empty. Create a new column to get started.
        </p>
        <button onClick={onAddColumn} className="add-column-btn">
          <Plus size={16} />
          Add New Column
        </button>
      </div>
    </div>
  );
};