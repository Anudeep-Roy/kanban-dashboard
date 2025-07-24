'use client';

import { useState, useEffect } from 'react';
import { Board } from '@/types/board';
import { X } from 'lucide-react';

interface BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (boardId: string, updates: Partial<Board>) => void;
  board?: Board;
}

export const BoardModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate, 
  board 
}: BoardModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (board) {
      setName(board.name);
    } else {
      setName('');
    }
  }, [board]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    if (board) {
      onUpdate(board.id, {
        name: name.trim(),
      });
    } else {
      onSave({
        name: name.trim(),
      });
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{board ? 'Edit Board' : 'Create New Board'}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Board Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter board name"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {board ? 'Update Board' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};