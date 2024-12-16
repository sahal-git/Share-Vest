import { createContext, useContext, useState, useEffect } from 'react';
import { StockType } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StockContextType = {
  stocks: StockType[];
  isLoading: boolean;
  error: string | null;
  refetchStocks: () => Promise<void>;
  watchlist: number[];
  addToWatchlist: (stockId: number) => void;
  removeFromWatchlist: (stockId: number) => void;
  isInWatchlist: (stockId: number) => boolean;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stocks from API
  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://sharvest.vercel.app/api/stocks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const { data } = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }
      
      setStocks(data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stocks');
    } finally {
      setIsLoading(false);
    }
  };

  // Load watchlist from AsyncStorage
  const loadWatchlist = async () => {
    try {
      const stored = await AsyncStorage.getItem('watchlist');
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  // Initial fetch and load
  useEffect(() => {
    fetchStocks();
    loadWatchlist();
  }, []);

  // Save watchlist to AsyncStorage whenever it changes
  useEffect(() => {
    const saveWatchlist = async () => {
      try {
        await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
      } catch (error) {
        console.error('Error saving watchlist:', error);
      }
    };

    saveWatchlist();
  }, [watchlist]);

  const addToWatchlist = (stockId: number) => {
    if (!watchlist.includes(stockId)) {
      setWatchlist([...watchlist, stockId]);
    }
  };

  const removeFromWatchlist = (stockId: number) => {
    setWatchlist(watchlist.filter(id => id !== stockId));
  };

  const isInWatchlist = (stockId: number) => {
    return watchlist.includes(stockId);
  };

  return (
    <StockContext.Provider value={{ 
      stocks, 
      isLoading, 
      error,
      refetchStocks: fetchStocks,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStocks() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStocks must be used within a StockProvider');
  }
  return context;
}

