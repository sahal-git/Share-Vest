import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StockType } from "@/types";
import { useRouter } from "expo-router";

export default function StockCard({
  stock,
  showTag = false,
}: {
  stock: StockType;
  showTag?: boolean;
}) {
  const router = useRouter();

  const isPositiveChange = stock.status.startsWith("+");

  const getIndustryIcon = () => {
    const industry = stock.industry.toLowerCase();

    switch (industry) {
      case "pharmaceuticals":
        return "pill" as const;
      case "automotive":
        return "car" as const;
      case "infrastructure & energy":
        return "flash" as const;
      case "cement & construction":
        return "factory" as const;
      case "jewelry & watches":
        return "diamond" as const;
      case "paints & coatings":
        return "palette" as const;
      case "information technology":
        return "laptop" as const;
      case "fmcg":
        return "shopping" as const;
      case "fmcg & hotels":
        return "shopping" as const;
      case "banking":
        return "bank" as const;
      case "steel & mining":
        return "anvil" as const;
      default:
        return "chart-line" as const;
    }
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

  return (
    <TouchableOpacity
      style={styles.stockCard}
      onPress={() => router.push({
        pathname: "/stock/[id]",
        params: { id: stock.id }
      })}
    >
      <View style={[styles.stockIcon, { backgroundColor: "#4CAF50" }]}>
        <MaterialCommunityIcons
          name={getIndustryIcon()}
          size={22}
          color={Colors.white}
        />
      </View>
      <View style={styles.stockInfo}>
        <View>
          <Text style={styles.stockName}>{stock.name}</Text>
          <Text style={styles.stockIndustry}>{stock.industry}</Text>
          <Text style={styles.stockRatio}>
            {stock.financial_details.non_compliant_income_ratio}
          </Text>
        </View>
        <View style={styles.priceInfo}>
          {showTag && stock.Share_Vest_Featured && (
            <View style={styles.featuredTag}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
          <View style={styles.priceContainer}>
            <Text style={styles.stockPrice}>{priceFormatted.whole}</Text>
            <Text style={styles.priceDecimal}>.{priceFormatted.decimal}</Text>
          </View>
          <Text
            style={[
              styles.stockChange,
              {
                color: isPositiveChange ? "#4CAF50" : "#FF5252",
              },
            ]}
          >
            {stock.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  stockCard: {
    flexDirection: "row",
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  stockIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stockInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stockName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  stockIndustry: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 4,
  },
  stockRatio: {
    color: Colors.blue,
    fontSize: 13,
  },
  priceInfo: {
    alignItems: "flex-end",
    gap: 4,
  },
  stockPrice: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  stockChange: {
    fontSize: 13,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  priceDecimal: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 1,
  },
  featuredTag: {
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "500",
  },
});
