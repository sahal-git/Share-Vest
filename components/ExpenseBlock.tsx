import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import ExpenseModal from "./ExpenseModal";
import { useAuth } from "@/context/AuthContext";
import { ExpenseType } from "@/types";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserExpenses = async (userId: string) => {
  try {
    const storedExpenses = await AsyncStorage.getItem(`userExpenses_${userId}`);
    if (storedExpenses) {
      return JSON.parse(storedExpenses) as ExpenseType[];
    }
  } catch (error) {
    console.error('Error loading user expenses:', error);
  }
  return null;
};

export const getTotalExpenses = async (userId: string) => {
  try {
    const storedExpenses = await AsyncStorage.getItem(`userExpenses_${userId}`);
    if (storedExpenses) {
      const expenses = JSON.parse(storedExpenses) as ExpenseType[];
      return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
    }
  } catch (error) {
    console.error('Error loading total expenses:', error);
  }
  return 0;
};

const MIN_CARD_WIDTH = 120; // Minimum width for expense cards
const MAX_CARD_WIDTH = 160; // Maximum width for expense cards

export default function ExpenseBlock({
  onAddExpense,
  onUpdateExpense,
  onTotalUpdate,
  expenseList: initialExpenseList,
}: {
  onAddExpense?: (expense: Partial<ExpenseType>) => void;
  onUpdateExpense?: (expense: Partial<ExpenseType>) => void;
  onTotalUpdate?: (total: number) => void;
  expenseList?: ExpenseType[];
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<
    ExpenseType | undefined
  >();
  const { user } = useAuth();
  const [expenseList, setExpenseList] = useState<ExpenseType[]>(initialExpenseList || []);

  const saveExpensesToStorage = async (expenses: ExpenseType[]) => {
    if (!user?.id) return;
    
    try {
      await AsyncStorage.setItem(`userExpenses_${user.id}`, JSON.stringify(expenses));
      const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      onTotalUpdate?.(total);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const loadExpensesFromStorage = async () => {
    if (!user?.id) return null;
    
    try {
      const storedExpenses = await AsyncStorage.getItem(`userExpenses_${user.id}`);
      if (storedExpenses) {
        return JSON.parse(storedExpenses) as ExpenseType[];
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
    return null;
  };

  useEffect(() => {
    const initializeExpenses = async () => {
      if (!user?.id) return;

      const storedExpenses = await loadExpensesFromStorage();
      
      if (storedExpenses) {
        setExpenseList(storedExpenses);
      } else if (user?.expenses) {
        const expenses: ExpenseType[] = [
          {
            id: 1,
            name: "Investments",
            amount: Number(user.expenses.investment),
            percentage: calculatePercentage(Number(user.expenses.investment)),
            userId: user.id,
          },
          {
            id: 2,
            name: "Housing",
            amount: Number(user.expenses.housing),
            percentage: calculatePercentage(Number(user.expenses.housing)),
            userId: user.id,
          },
          {
            id: 3,
            name: "Food",
            amount: Number(user.expenses.food),
            percentage: calculatePercentage(Number(user.expenses.food)),
            userId: user.id,
          },
          {
            id: 4,
            name: "Savings",
            amount: Number(user.expenses.saving),
            percentage: calculatePercentage(Number(user.expenses.saving)),
            userId: user.id,
          },
        ];
        setExpenseList(expenses);
        saveExpensesToStorage(expenses);
      }
    };

    initializeExpenses();
  }, [user?.id, user?.expenses]);

  const calculatePercentage = (amount: number) => {
    if (!user?.expenses) return 0;
    
    const total = expenseList.reduce((sum, expense) => sum + expense.amount, 0);
    
    return total === 0 ? 0 : (amount / total) * 100;
  };

  const handleExpensePress = (expense?: ExpenseType) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const handleSave = async (expense: Partial<ExpenseType>) => {
    let updatedList: ExpenseType[];
    
    if (selectedExpense) {
      onUpdateExpense?.({ ...expense, id: selectedExpense.id });
      
      updatedList = expenseList.map(item => 
        item.id === selectedExpense.id 
          ? { ...item, ...expense, percentage: calculatePercentage(expense.amount || 0) }
          : { ...item, percentage: calculatePercentage(item.amount) }
      );
    } else {
      const existingExpense = expenseList.find(
        item => item.name?.toLowerCase() === expense.name?.toLowerCase()
      );

      if (existingExpense) {
        const updatedAmount = (existingExpense.amount || 0) + (expense.amount || 0);
        const updatedExpense = {
          ...existingExpense,
          amount: updatedAmount,
          percentage: calculatePercentage(updatedAmount)
        };

        onUpdateExpense?.(updatedExpense);
        
        updatedList = expenseList.map(item => 
          item.id === existingExpense.id 
            ? updatedExpense
            : { ...item, percentage: calculatePercentage(item.amount) }
        );
      } else {
        const newExpense: ExpenseType = {
          ...expense,
          id: Math.max(0, ...expenseList.map(e => e.id)) + 1,
          name: expense.name || '',
          amount: expense.amount || 0,
          percentage: calculatePercentage(expense.amount || 0)
        };
        
        onAddExpense?.(newExpense);
        updatedList = [...expenseList, newExpense].map(item => ({
          ...item,
          percentage: calculatePercentage(item.amount)
        })) as ExpenseType[];
      }
    }

    setExpenseList(updatedList);
    await saveExpensesToStorage(updatedList);
    setModalVisible(false);
    setSelectedExpense(undefined);
  };

  const sortedExpenses = [...expenseList].sort((a, b) => {
    if (a.name === "Investments") return -1;
    if (b.name === "Investments") return 1;
    return 0;
  });

  const getBackgroundColor = (name: string = "") => {
    const lowercaseName = name.toLowerCase();

    switch (lowercaseName) {
      case "investments":
        return Colors.tintColor;
      case "savings":
        return Colors.white;
      case "food":
        return "#FF5722";
      case "housing":
        return "#0097A7";
      default:
        return Colors.blue;
    }
  };

  const getTextColor = (backgroundColor: string, name: string) => {
    const whiteTextCategories = ["investments", "housing"];
    if (whiteTextCategories.includes(name.toLowerCase())) {
      return Colors.white;
    }

    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? Colors.black : Colors.white;
  };

  const getCardWidth = (name: string = "") => {
    // Calculate approximate text width (rough estimation)
    const textLength = name.length;
    const estimatedWidth = Math.min(
      MAX_CARD_WIDTH,
      Math.max(MIN_CARD_WIDTH, textLength * 8) // 8 pixels per character as estimation
    );
    return estimatedWidth;
  };

  const renderItem: ListRenderItem<Partial<ExpenseType>> = ({
    item,
    index,
  }) => {
    if (index === 0)
      return (
        <TouchableOpacity onPress={() => handleExpensePress()}>
          <View style={[styles.AddItemButton, { width: MIN_CARD_WIDTH }]}>
            <Feather name="plus" size={24} color={"#ccc"} />
          </View>
        </TouchableOpacity>
      );

    const amount = item.amount?.toFixed(2).split(".");
    const backgroundColor = getBackgroundColor(item.name);
    const textColor = getTextColor(backgroundColor, item.name || "");
    const cardWidth = getCardWidth(item.name);

    const formatPercentage = (percentage: number | undefined) => {
      if (!percentage) return "0.00%";
      if (percentage < 1) return percentage.toFixed(2) + "%";
      if (percentage < 10) return percentage.toFixed(1) + "%";
      return Math.round(percentage) + "%";
    };

    return (
      <TouchableOpacity onPress={() => handleExpensePress(item as ExpenseType)}>
        <View 
          style={[
            styles.ExpenseBlock, 
            { 
              backgroundColor,
              width: cardWidth
            }
          ]}
        >
          <Text 
            style={[
              styles.ExpenseBlockText1, 
              { 
                color: textColor,
                numberOfLines: 1,
                ellipsizeMode: 'tail'
              }
            ]}
          >
            {item.name}
          </Text>
          <Text style={[styles.ExpenseBlockText2, { color: textColor }]}>
            ₹{amount?.[0]}.
            <Text style={[styles.ExpenseBlockText2Span, { color: textColor }]}>
              {amount?.[1]}
            </Text>
          </Text>
          <View style={styles.ExpenseBlockPercentage}>
            <Text style={[styles.ExpenseBlockText1, { color: textColor }]}>
              {formatPercentage(item.percentage)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ name: "Add Item" }, ...sortedExpenses]}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={MIN_CARD_WIDTH + 20} // Add snapping behavior
      />
      <ExpenseModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedExpense(undefined);
        }}
        onSave={handleSave}
        expense={selectedExpense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  ExpenseBlock: {
    padding: 15,
    borderRadius: 15,
    marginRight: 20,
    gap: 10,
    height: 120, // Fixed height
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  ExpenseBlockText1: {
    color: Colors.white,
    fontSize: 14,
    width: '100%', // Allow text to use full width
  },
  ExpenseBlockText2: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 600,
  },
  ExpenseBlockText2Span: {
    fontSize: 12,
    fontWeight: 400,
  },
  ExpenseBlockPercentage: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  AddItemButton: {
    height: 120, // Match ExpenseBlock height
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 20,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
