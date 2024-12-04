import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExpenseContextType {
  expenses: {
    investment: string;
    housing: string;
    entertainment: string;
  };
  updateExpenses: (newExpenses: any) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType>({} as ExpenseContextType);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState({
    investment: "",
    housing: "",
    entertainment: "",
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const savedExpenses = await AsyncStorage.getItem('expenses');
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.log('Error loading expenses:', error);
    }
  };

  const updateExpenses = async (newExpenses: any) => {
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.log('Error updating expenses:', error);
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, updateExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext); 