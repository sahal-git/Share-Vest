import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import StockList from "@/data/stocks.json";
import StockCard from "@/components/StockCard";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWatchlist } from '@/context/WatchlistContext';
import SubScreenHeader from "@/components/SubScreenHeader";

export default function WatchlistPage() {
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const watchlistedStocks = StockList.filter(stock => watchlist.includes(stock.id));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <SubScreenHeader title="Watchlist" />
        {/* Rest of your existing content */}
        {watchlistedStocks.length > 0 ? (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stockList}>
              {watchlistedStocks.map((stock) => (
                <StockCard 
                  key={stock.id} 
                  stock={stock}
                  showTag={false}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons 
              name="bookmark-outline" 
              size={64} 
              color={Colors.gray}
            />
            <Text style={styles.emptyTitle}>No stocks in watchlist</Text>
            <Text style={styles.emptyText}>
              Add stocks to your watchlist to track them easily
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  stockList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 