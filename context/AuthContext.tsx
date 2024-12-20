import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  signUp: (name: string, email: string, password: string, phone: string, avatar: string, expenses: {
    investment: string;
    housing: string;
    food: string;
    saving: string;
  }) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const [userJson, loginStatus] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('isLoggedIn')
      ]);
      
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
      setIsLoggedIn(loginStatus === 'true');
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    avatar: string,
    expenses: {
      investment: string;
      housing: string;
      food: string;
      saving: string;
    }
  ) => {
    try {
      // Convert expense strings to numbers
      const expenseAmounts = {
        investment: Number(expenses.investment),
        housing: Number(expenses.housing),
        food: Number(expenses.food),
        saving: Number(expenses.saving)
      };
      
      // Calculate total for percentage calculation
      const totalExpense = Object.values(expenseAmounts).reduce((sum, amount) => sum + amount, 0);

      // Calculate exact percentages
      const initialExpenses: ExpenseType[] = [
        {
          id: 1,
          userId: Date.now().toString(),
          name: "Investments",
          amount: expenseAmounts.investment,
          percentage: Math.round((expenseAmounts.investment / totalExpense) * 100)
        },
        {
          id: 2,
          userId: Date.now().toString(),
          name: "Housing",
          amount: expenseAmounts.housing,
          percentage: Math.round((expenseAmounts.housing / totalExpense) * 100)
        },
        {
          id: 3,
          userId: Date.now().toString(),
          name: "Food",
          amount: expenseAmounts.food,
          percentage: Math.round((expenseAmounts.food / totalExpense) * 100)
        },
        {
          id: 4,
          userId: Date.now().toString(),
          name: "Savings",
          amount: expenseAmounts.saving,
          percentage: Math.round((expenseAmounts.saving / totalExpense) * 100)
        }
      ];

      // Save initial expenses
      await AsyncStorage.setItem(
        `userExpenses_${Date.now().toString()}`, 
        JSON.stringify(initialExpenses)
      );

      const users = await getUsers();
      if (users.some(u => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        phone,
        avatar,
        expenses,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);
      
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const users = await getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        await Promise.all([
          AsyncStorage.setItem('user', JSON.stringify(user)),
          AsyncStorage.setItem('isLoggedIn', 'true')
        ]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.setItem('isLoggedIn', 'false')
      ]);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return false;

      // Get all users
      const users = await getUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) return false;

      // Update user data
      const updatedUser = {
        ...users[userIndex],
        ...data,
      };

      // Update users list
      users[userIndex] = updatedUser;
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Update current user
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isLoggedIn, 
      signUp, 
      signIn, 
      signOut,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);