import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import StockCard from "./StockCard";
import { useStocks } from "@/context/StockContext";

export default function StockBlock({
  showFeatured = true,
  showWatchlistButton = false,
}: {
  showFeatured?: boolean;
  showWatchlistButton?: boolean;
}) {
  const { stocks, isLoading, error } = useStocks();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.tintColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load stocks</Text>
      </View>
    );
  }

  const filteredStocks = stocks.filter(stock => stock.Share_Vest_Featured);

  if (filteredStocks.length === 0) {
    return null;
  }

  return (
    <View style={{ marginVertical: 20, marginBottom: 100 }}>
      <Text style={styles.stockListTitle}>
        Featured <Text style={{ fontWeight: "bold" }}>Stocks</Text>
      </Text>

      {filteredStocks.map((stock) => (
        <StockCard 
          key={stock.id} 
          stock={stock} 
          showTag={false}
          showWatchlistButton={showWatchlistButton}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stockListTitle: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 15,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
});
