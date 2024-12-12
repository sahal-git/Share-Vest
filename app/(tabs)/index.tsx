import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import { PieChart } from "react-native-gifted-charts";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import ExpenseBlock from "@/components/ExpenseBlock";
import CourseList from "@/data/courses.json";
import CourseBlock from "@/components/CourseBlock";
import StockBlock from "@/components/StockBlock";
import StockList from "@/data/stocks.json";
import { ExpenseType } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { getUserExpenses, getTotalExpenses } from '@/components/ExpenseBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      // Load user's expenses
      const userExpenses = await getUserExpenses(user.id);
      if (userExpenses && userExpenses.length > 0) {
        // Recalculate percentages when loading expenses
        const totalAmount = userExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        
        const expensesWithPercentages = userExpenses.map(expense => ({
          ...expense,
          percentage: Math.round((expense.amount / totalAmount) * 100)
        }));
        
        setExpenses(expensesWithPercentages);
        setTotalExpenses(totalAmount);
      }
    };

    loadUserData();
  }, [user?.id]);

  const handleTotalUpdate = (newTotal: number) => {
    setTotalExpenses(newTotal);
  };

  const formattedTotal = totalExpenses.toFixed(2).split(".");

  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.name.toLowerCase();
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const formattedCategoryTotals = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: amount.toFixed(2),
    })
  );

  const getBackgroundColor = (name: string = "") => {
    const lowercaseName = name.toLowerCase();

    switch (lowercaseName) {
      case "investments":
        return Colors.tintColor;
      case "savings":
        return Colors.white;
      case "food":
      case "groceries":
        return "#FF5722";
      case "entertainment":
        return "#7B1FA2";
      case "shopping":
        return "#F57C00";
      case "travel":
        return "#FDD835";
      case "personal":
        return "#C2185B";
      case "utilities":
        return "#0097A7";
      case "healthcare":
        return "#388E3C";
      default:
        return Colors.blue;
    }
  };

  const getTextColor = (backgroundColor: string) => {
    // Convert hex to RGB and calculate brightness
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;

    // Calculate perceived brightness (human eye favors green)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Use white text for dark backgrounds, black for light backgrounds
    return brightness > 155 ? Colors.black : Colors.white;
  };

  const pieData = expenses.map((expense) => {
    const bgColor = getBackgroundColor(expense.name);
    const percentage = expense.percentage || Math.round((expense.amount / totalExpenses) * 100);
    
    return {
      value: expense.amount,
      color: bgColor,
      text: `${percentage}%`,
      textColor: getTextColor(bgColor),
      focused: expense.name === "Investments",
      gradientCenterColor:
        expense.name === "Investments" ? Colors.tintColor : undefined,
    };
  });

  const calculatePercentage = (amount: number) => {
    const totalExpenses =
      expenses.reduce((sum, expense) => sum + expense.amount, 0) + amount;
    return Math.round((amount / totalExpenses) * 100);
  };

  const recalculateAllPercentages = (newExpenses: ExpenseType[]) => {
    const totalAmount = newExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return newExpenses.map((expense) => ({
      ...expense,
      percentage: Math.round((expense.amount / totalAmount) * 100),
    }));
  };

  const handleAddExpense = async (newExpense: Partial<ExpenseType>) => {
    if (!user?.id) return;

    const existingExpenseIndex = expenses.findIndex(
      (exp) => exp.name?.toLowerCase() === newExpense.name?.toLowerCase()
    );

    let updatedExpenses: ExpenseType[];

    if (existingExpenseIndex !== -1) {
      updatedExpenses = [...expenses];
      const existingExpense = updatedExpenses[existingExpenseIndex];
      updatedExpenses[existingExpenseIndex] = {
        ...existingExpense,
        amount: (existingExpense.amount || 0) + (newExpense.amount || 0),
      };
    } else {
      const expense = {
        ...newExpense,
        id: Math.max(0, ...expenses.map(e => e.id)) + 1,
        userId: user.id,
        percentage: calculatePercentage(newExpense.amount || 0),
      } as ExpenseType;

      updatedExpenses = [...expenses, expense];
    }

    const recalculatedExpenses = recalculateAllPercentages(updatedExpenses);
    setExpenses(recalculatedExpenses);
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(
      `userExpenses_${user.id}`,
      JSON.stringify(recalculatedExpenses)
    );
  };

  const handleUpdateExpense = async (updatedExpense: Partial<ExpenseType>) => {
    if (!user?.id) return;

    const newExpenses = expenses.map((exp) =>
      exp.id === updatedExpense.id
        ? ({ ...exp, ...updatedExpense } as ExpenseType)
        : exp
    );
    
    const recalculatedExpenses = recalculateAllPercentages(newExpenses);
    setExpenses(recalculatedExpenses);
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(
      `userExpenses_${user.id}`,
      JSON.stringify(recalculatedExpenses)
    );
  };

  const shouldShowPieChart = () => {
    return expenses.length > 0 && expenses.some(exp => exp.amount > 0);
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <View style={[styles.container, { paddingTop: 80 }]}>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ gap: 3 }}>
              <Text style={{ color: Colors.white, fontSize: 16 }}>
                My <Text style={{ fontWeight: "bold" }}>Expenses</Text>
              </Text>
              <Text
                style={{ color: Colors.white, fontSize: 35, fontWeight: 700 }}
              >
                ₹{formattedTotal[0]}.
                <Text style={{ fontSize: 22, fontWeight: 400 }}>
                  {formattedTotal[1]}
                </Text>
              </Text>
            </View>
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              {shouldShowPieChart() ? (
                <PieChart
                  data={pieData}
                  donut
                  showGradient
                  sectionAutoFocus
                  radius={70}
                  innerRadius={55}
                  semiCircle
                  innerCircleColor={Colors.black}
                  centerLabelComponent={() => {
                    const investmentExp = expenses.find(
                      (exp) => exp.name === "Investments"
                    );
                    const centerValue = investmentExp?.percentage || 0;

                    return (
                      <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {centerValue}%
                        </Text>
                      </View>
                    );
                  }}
                />
              ) : (
                <View style={{ 
                  width: 140, 
                  height: 70, 
                  justifyContent: "center", 
                  alignItems: "center",
                  backgroundColor: Colors.black 
                }}>
                  <Text style={{ color: Colors.white, textAlign: 'center' }}>
                    Add expenses to see chart
                  </Text>
                </View>
              )}
            </View>
          </View>
          <ExpenseBlock
            expenseList={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onTotalUpdate={handleTotalUpdate}
          />
          <CourseBlock 
            text="Your" 
            textBold="Courses" 
            courseList={CourseList} 
            showTags={false} 
            showEnrolled={false}
          />
          <StockBlock 
            stockList={StockList} 
            showFeatured={true}
            showWatchlistButton={true}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    zIndex: 0,
    pointerEvents: "none",
  },
});
