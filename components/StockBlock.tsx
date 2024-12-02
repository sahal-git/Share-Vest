import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StockType } from "@/types";
import Colors from "@/constants/Colors";
import StockCard from "./StockCard";

export default function StockBlock({
  stockList,
  showFeatured = true,
  showWatchlistButton = false,
}: {
  stockList: StockType[];
  showFeatured?: boolean;
  showWatchlistButton?: boolean;
}) {
  const filteredStocks = stockList.filter(stock => stock.Share_Vest_Featured);

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
});
