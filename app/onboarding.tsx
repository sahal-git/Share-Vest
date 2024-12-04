import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExpenses } from "@/context/ExpenseContext";
import { StatusBar } from 'expo-status-bar';
import ExpenseList from "@/data/expenses.json";

const { width, height } = Dimensions.get("window");

interface OnboardingItem {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: "rocket-launch" | "school" | "chart-line" | "wallet";
  isLast?: boolean;
}

interface ExpenseData {
  investment: string;
  housing: string;
  entertainment: string;
  savings: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: "Find Your Dream Investment",
    description: "Search and find halal investment opportunities easily and quickly",
    image: "https://img.freepik.com/free-vector/finance-services-financial-transaction-e-commerce-e-payment_335657-3134.jpg",
    icon: "rocket-launch",
  },
  {
    id: 2,
    title: "Learn & Grow",
    description: "Get expert guidance and start your investment journey",
    image: "https://img.freepik.com/free-vector/investor-with-laptop-monitoring-growth-dividends-trader-with-computer-studying-trading-graph-analyzing-financial-statistics-vector-illustration-finance-stock-trading-investment_74855-8432.jpg",
    icon: "school",
  },
  {
    id: 3,
    title: "Track Your Success",
    description: "Monitor your portfolio growth and stay updated with market trends",
    image: "https://img.freepik.com/free-vector/stock-market-analysis-concept_23-2148604352.jpg",
    icon: "chart-line",
  },
  {
    id: 4,
    title: "What Were Your Expenses?",
    description: "Help us understand your monthly spending and saving patterns",
    icon: "wallet",
    image: "",
    isLast: true,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    investment: "",
    housing: "",
    entertainment: "",
    savings: "",
  });
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { updateExpenses } = useExpenses();

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      if (Object.values(expenseData).every((value) => value.trim() !== "")) {
        try {
          await updateExpenses(expenseData);
          await AsyncStorage.setItem("hasOnboarded", "true");
          router.replace("/(tabs)");
        } catch (error) {
          Alert.alert(
            "Error",
            "Failed to save your preferences. Please try again."
          );
        }
      } else {
        Alert.alert(
          "Incomplete Information",
          "Please fill in all expense categories to continue"
        );
      }
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      {!item.isLast ? (
        <>
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.image}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.imageGradient}
              />
              <View style={styles.iconOverlay}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={32}
                    color={Colors.white}
                  />
                </View>
              </View>
            </View>

            <View style={styles.textContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        </>
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.expenseContainer}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.expenseHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={32}
                  color={Colors.white}
                />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <View style={styles.expenseForm}>
              <Text style={styles.formTitle}>Last Month's Expenses</Text>
              {Object.keys(expenseData).map((key) => (
                <View key={key} style={styles.inputContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      {key === 'savings' ? 'Monthly Savings' : `${key.charAt(0).toUpperCase() + key.slice(1)} Expenses`}
                    </Text>
                    <Text style={styles.sublabel}>Last Month</Text>
                  </View>
                  <View style={[
                    styles.inputWrapper,
                    key === 'savings' && styles.savingsInput
                  ]}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="numeric"
                      value={expenseData[key as keyof ExpenseData]}
                      onChangeText={(text) =>
                        setExpenseData((prev) => ({ ...prev, [key]: text }))
                      }
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleNext}
        >
          <LinearGradient
            colors={[Colors.tintColor, '#00B894']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
  },
  slide: {
    flex: 1,
    width,
    backgroundColor: Colors.black,
  },
  contentContainer: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.5,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.tintColor,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.tintColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContent: {
    padding: 40,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  expenseContainer: {
    flex: 1,
    padding: 24,
  },
  expenseHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  expenseForm: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  savingsInput: {
    backgroundColor: 'rgba(0,184,148,0.1)',
    borderColor: 'rgba(0,184,148,0.3)',
    borderWidth: 1,
  },
  currencySymbol: {
    color: Colors.white,
    fontSize: 16,
    paddingLeft: 16,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    padding: 16,
    paddingLeft: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: Colors.black,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.tintColor,
  },
  button: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 24,
    textAlign: 'center',
  },
  sublabel: {
    fontSize: 12,
    color: Colors.tintColor,
    opacity: 0.9,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
