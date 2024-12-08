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

export default function ExpenseBlock({
  onAddExpense,
  onUpdateExpense,
}: {
  onAddExpense?: (expense: Partial<ExpenseType>) => void;
  onUpdateExpense?: (expense: Partial<ExpenseType>) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | undefined>();
  const { user } = useAuth();
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);

  useEffect(() => {
    if (user?.expenses) {
      // Convert user expenses to ExpenseType format
      const expenses: ExpenseType[] = [
        {
          id: '1',
          name: 'Investments',
          amount: Number(user.expenses.investment),
          percentage: calculatePercentage(Number(user.expenses.investment)),
        },
        {
          id: '2',
          name: 'Housing',
          amount: Number(user.expenses.housing),
          percentage: calculatePercentage(Number(user.expenses.housing)),
        },
        {
          id: '3',
          name: 'Food',
          amount: Number(user.expenses.food),
          percentage: calculatePercentage(Number(user.expenses.food)),
        },
        {
          id: '4',
          name: 'Savings',
          amount: Number(user.expenses.saving),
          percentage: calculatePercentage(Number(user.expenses.saving)),
        },
      ];
      setExpenseList(expenses);
    }
  }, [user?.expenses]);

  const calculatePercentage = (amount: number) => {
    if (!user?.expenses) return 0;
    const total = Number(user.expenses.investment) +
                 Number(user.expenses.housing) +
                 Number(user.expenses.food) +
                 Number(user.expenses.saving);
    return (amount / total) * 100;
  };

  const handleExpensePress = (expense?: ExpenseType) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const handleSave = (expense: Partial<ExpenseType>) => {
    if (selectedExpense) {
      onUpdateExpense?.({ ...expense, id: selectedExpense.id });
    } else {
      onAddExpense?.(expense);
    }
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

    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? Colors.black : Colors.white;
  };

  const renderItem: ListRenderItem<Partial<ExpenseType>> = ({ item, index }) => {
    if (index === 0)
      return (
        <TouchableOpacity onPress={() => handleExpensePress()}>
          <View style={styles.AddItemButton}>
            <Feather name="plus" size={24} color={"#ccc"} />
          </View>
        </TouchableOpacity>
      );

    const amount = item.amount?.toFixed(2).split(".");
    const backgroundColor = getBackgroundColor(item.name);
    const textColor = getTextColor(backgroundColor, item.name || "");

    const formatPercentage = (percentage: number | undefined) => {
      if (!percentage) return "0.00%";
      if (percentage < 1) return percentage.toFixed(2) + "%";
      if (percentage < 10) return percentage.toFixed(1) + "%";
      return Math.round(percentage) + "%";
    };

    return (
      <TouchableOpacity onPress={() => handleExpensePress(item as ExpenseType)}>
        <View style={[styles.ExpenseBlock, { backgroundColor }]}>
          <Text style={[styles.ExpenseBlockText1, { color: textColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.ExpenseBlockText2, { color: textColor }]}>
            ₹{amount?.[0]}.<Text style={[styles.ExpenseBlockText2Span, { color: textColor }]}>
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
    backgroundColor: Colors.tintColor,
    width: 120,
    padding: 15,
    borderRadius: 15,
    marginRight: 20,
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  ExpenseBlockText1: {
    color: Colors.white,
    fontSize: 14,
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
    flex: 1,
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
