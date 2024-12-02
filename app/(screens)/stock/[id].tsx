import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StockType } from "@/types";
import StockList from "@/data/stocks.json";
import { LineChart } from "react-native-chart-kit";
import { useWatchlist } from "@/context/WatchlistContext";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface CompanyInfo {
  founded: string;
  headquarters: string;
  employees: string;
  sector: string;
  website: string;
}

// Mock company info (you can add this to your stock data)
const companyInfo: CompanyInfo = {
  founded: "1995",
  headquarters: "Mumbai, India",
  employees: "50,000+",
  sector: "Technology",
  website: "www.company.com",
};

export default function StockDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const stock = StockList.find((s) => s.id.toString() === id) as StockType;
  const { isWatchlisted, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1D");
  const [activeTab, setActiveTab] = useState<
    "overview" | "fundamentals" | "news"
  >("overview");

  // Mock data for different timeframes
  const chartData = {
    "1D": [20, 45, 28, 80, 99, 43],
    "1W": [33, 55, 41, 70, 20, 50],
    "1M": [25, 35, 60, 45, 90, 85],
    "1Y": [40, 65, 75, 50, 80, 95],
  };

  const formatPrice = (price: string) => {
    const cleanPrice = price.replace(/[^\d.]/g, "");
    const [whole, decimal] = cleanPrice.split(".");
    return {
      whole: `₹${whole}`,
      decimal: decimal || "00",
    };
  };

  const priceFormatted = formatPrice(stock.price);
  const isPositiveChange = stock.status.startsWith("+");

  const handleWatchlistToggle = () => {
    if (isWatchlisted(stock.id)) {
      removeFromWatchlist(stock.id);
    } else {
      addToWatchlist(stock.id);
    }
  };

  const handleInvestNow = () => {
    // Add your invest logic here
    alert('Investment feature coming soon!');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={Colors.white} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stock.name}</Text>
        <View style={{ width: 40 }} /> {/* Empty view for alignment */}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Price Info */}
        <View style={styles.priceSection}>
          <Text style={styles.stockCode}>NSE: {stock.full_name}</Text>
          <Text style={styles.price}>
            {priceFormatted.whole}
            <Text style={styles.decimal}>.{priceFormatted.decimal}</Text>
          </Text>
          <Text
            style={[
              styles.change,
              {
                color: isPositiveChange ? "#4CAF50" : "#FF5252",
                backgroundColor: isPositiveChange
                  ? "rgba(76,175,80,0.1)"
                  : "rgba(255,82,82,0.1)",
              },
            ]}
          >
            {stock.status}
          </Text>
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <LineChart
            data={{
              labels: [],
              datasets: [
                {
                  data: chartData[timeframe],
                },
              ],
            }}
            width={width - 32}
            height={220}
            chartConfig={{
              backgroundColor: Colors.black,
              backgroundGradientFrom: Colors.black,
              backgroundGradientTo: Colors.black,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: () => Colors.white,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "0",
              },
            }}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Time Frames */}
        <View style={styles.timeframes}>
          {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeframeBtn,
                timeframe === tf && styles.activeTimeframe,
              ]}
              onPress={() => setTimeframe(tf)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  timeframe === tf && styles.activeTimeframeText,
                ]}
              >
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          {(["overview", "fundamentals", "news"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "overview" && (
          <>
            {/* Key Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Market Cap</Text>
                    <Text style={styles.statValue}>
                      {stock.financial_details.market_cap}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>52W High</Text>
                    <Text style={styles.statValue}>₹1,245.00</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>52W Low</Text>
                    <Text style={styles.statValue}>₹890.25</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>P/E Ratio</Text>
                    <Text style={styles.statValue}>24.5</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Shariah Compliance */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={24}
                    color={Colors.tintColor}
                  />
                </View>
                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
                  Shariah Compliance
                </Text>
              </View>
              <View style={styles.complianceCard}>
                <View style={styles.complianceItem}>
                  <Text style={styles.complianceLabel}>
                    Non-Compliant Income
                  </Text>
                  <Text style={styles.complianceValue}>
                    {stock.financial_details.non_compliant_income_ratio}
                  </Text>
                  <View
                    style={[
                      styles.complianceIndicator,
                      {
                        backgroundColor:
                          parseFloat(
                            stock.financial_details.non_compliant_income_ratio
                          ) < 5
                            ? "#4CAF50"
                            : "#FF5252",
                      },
                    ]}
                  />
                </View>
                <View
                  style={[styles.complianceItem, styles.lastComplianceItem]}
                >
                  <Text style={styles.complianceLabel}>Debt to Assets</Text>
                  <Text style={styles.complianceValue}>
                    {stock.financial_details.debt_to_assets_ratio}
                  </Text>
                  <View
                    style={[
                      styles.complianceIndicator,
                      {
                        backgroundColor:
                          parseFloat(
                            stock.financial_details.debt_to_assets_ratio
                          ) < 33
                            ? "#4CAF50"
                            : "#FF5252",
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Company Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company Information</Text>
              <View style={styles.infoCard}>
                {Object.entries(companyInfo).map(([key, value]) => (
                  <View key={key} style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <Text style={styles.infoValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{stock.description}</Text>
            </View>
          </>
        )}

        {activeTab === "fundamentals" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Ratios</Text>
            <View style={styles.fundamentalsGrid}>
              {Object.entries(stock.fundamentals).map(([key, value]) => (
                <View key={key} style={styles.fundamentalItem}>
                  <Text style={styles.fundamentalLabel}>
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Text>
                  <Text style={styles.fundamentalValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "news" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            {stock.news.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.newsCard}
                onPress={() => Linking.openURL(item.url)}
              >
                <View style={styles.newsHeader}>
                  <Text style={styles.newsSource}>{item.source}</Text>
                  <Text style={styles.newsDate}>{item.date}</Text>
                </View>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsSummary} numberOfLines={2}>
                  {item.summary}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <LinearGradient
        style={styles.buttonGradient}
        colors={[
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.8)',
          'rgba(0,0,0,0.9)',
          'rgba(0,0,0,1)',
        ]}
        pointerEvents="none"
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.watchlistButton]}
          onPress={handleWatchlistToggle}
        >
          <MaterialCommunityIcons 
            name={isWatchlisted(stock.id) ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={Colors.white} 
          />
          <Text style={styles.buttonText}>
            {isWatchlisted(stock.id) ? 'Remove' : 'Add to Watchlist'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.investButton]}
          onPress={handleInvestNow}
        >
          <MaterialCommunityIcons 
            name="cash-multiple" 
            size={24} 
            color={Colors.white} 
          />
          <Text style={styles.buttonText}>Invest Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  priceSection: {
    padding: 16,
  },
  stockCode: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  price: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: "600",
    marginTop: 4,
  },
  decimal: {
    fontSize: 24,
  },
  change: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  chartSection: {
    padding: 16,
  },
  timeframes: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  timeframeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTimeframe: {
    backgroundColor: Colors.tintColor,
  },
  timeframeText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  activeTimeframeText: {
    opacity: 1,
    fontWeight: "500",
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.tintColor,
  },
  tabText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  activeTabText: {
    opacity: 1,
    fontWeight: "500",
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 24,
    marginRight: 8,
    justifyContent: "center",
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    backgroundColor: Colors.gray,
    padding: 16,
    borderRadius: 12,
    width: "48%",
  },
  statLabel: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  complianceCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
  },
  complianceItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 16,
  },
  lastComplianceItem: {
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  complianceIndicator: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  complianceLabel: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 4,
  },
  complianceValue: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  infoLabel: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  infoValue: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
  fundamentalsGrid: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
  },
  fundamentalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  fundamentalLabel: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  fundamentalValue: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  newsCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  newsSource: {
    color: Colors.tintColor,
    fontSize: 14,
  },
  newsDate: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  newsTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  newsSummary: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  watchlistButton: {
    backgroundColor: Colors.gray,
  },
  investButton: {
    backgroundColor: Colors.tintColor,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
