import React, { createContext, useContext, useState } from 'react';
import { StockType } from '@/types';

type WatchlistContextType = {
  watchlist: number[];  // Array of stock IDs
  addToWatchlist: (stockId: number) => void;
  removeFromWatchlist: (stockId: number) => void;
  isWatchlisted: (stockId: number) => boolean;
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<number[]>([]);

  const addToWatchlist = (stockId: number) => {
    setWatchlist(prev => [...prev, stockId]);
  };

  const removeFromWatchlist = (stockId: number) => {
    setWatchlist(prev => prev.filter(id => id !== stockId));
  };

  const isWatchlisted = (stockId: number) => {
    return watchlist.includes(stockId);
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      addToWatchlist, 
      removeFromWatchlist, 
      isWatchlisted 
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
} 