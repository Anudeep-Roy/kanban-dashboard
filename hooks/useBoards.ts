'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Board } from '@/types/board';

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'boards'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const boardsData: Board[] = [];
      querySnapshot.forEach((doc) => {
        boardsData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Board);
      });
      setBoards(boardsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addBoard = async (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'boards'), {
        ...board,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding board:', error);
      throw error;
    }
  };

  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    try {
      await updateDoc(doc(db, 'boards', boardId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating board:', error);
      throw error;
    }
  };

  const deleteBoard = async (boardId: string) => {
    try {
      await deleteDoc(doc(db, 'boards', boardId));
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  };

  return {
    boards,
    loading,
    addBoard,
    updateBoard,
    deleteBoard,
  };
};