import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import ExpenseBlock from "@/components/ExpenseBlock";
import ExpenseList from "@/data/expenses.json";
import CourseList from "@/data/courses.json";
import CourseBlock from "@/components/CourseBlock";
import StockBlock from "@/components/StockBlock";
import StockList from "@/data/stocks.json";
import { ExpenseType } from "@/types";

export default function Page() {
  const [expenses, setExpenses] = useState(ExpenseList);

  const handleAddExpense = (newExpense: Partial<ExpenseType>) => {
    const existingExpenseIndex = expenses.findIndex(
      (exp) => exp.name.toLowerCase() === newExpense.name?.toLowerCase()
    );

    if (existingExpenseIndex !== -1) {
      const updatedExpenses = [...expenses];
      const existingExpense = updatedExpenses[existingExpenseIndex];
      updatedExpenses[existingExpenseIndex] = {
        ...existingExpense,
        amount: existingExpense.amount + (newExpense.amount || 0),
      };
      setExpenses(recalculateAllPercentages(updatedExpenses));
    } else {
      const expense = {
        ...newExpense,
        id: expenses.length + 1,
        percentage: calculatePercentage(newExpense.amount || 0),
      } as ExpenseType;

      const updatedExpenses = [...expenses, expense];
      setExpenses(recalculateAllPercentages(updatedExpenses));
    }
  };

  const handleUpdateExpense = (updatedExpense: Partial<ExpenseType>) => {
    const newExpenses = expenses.map((exp) =>
      exp.id === updatedExpense.id
        ? ({ ...exp, ...updatedExpense } as ExpenseType)
        : exp
    );
    setExpenses(recalculateAllPercentages(newExpenses));
  };

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

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <View style={[styles.container, { paddingTop: 80 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ExpenseBlock
            expenseList={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
          />
          <CourseBlock 
            text="Your" 
            textBold="Courses" 
            courseList={CourseList} 
            showTags={false} 
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
});
