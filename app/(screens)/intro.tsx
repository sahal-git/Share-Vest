import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Islamic Investment',
    description: 'Learn and invest in Shariah-compliant stocks and financial instruments',
    icon: 'mosque',
  },
  {
    id: 2,
    title: 'Track Investments',
    description: 'Monitor your favorite stocks and get real-time market updates',
    icon: 'chart-line',
  },
  {
    id: 3,
    title: 'Learn & Grow',
    description: 'Access comprehensive courses on Islamic finance and investment strategies',
    icon: 'school',
  },
  {
    id: 4,
    title: 'Stay Compliant',
    description: 'Ensure your investments align with Islamic principles and values',
    icon: 'shield-check',
  },
];

export default function IntroScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = async () => {
    if (currentPage === slides.length - 1) {
      await AsyncStorage.setItem('hasSeenIntro', 'true');
      router.push('/(screens)/onboarding');
    } else {
      setCurrentPage(prev => prev + 1);
    }
  };

  const currentSlide = slides[currentPage];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInRight.delay(300)}
          style={styles.slideContent}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={currentSlide.icon as any}
              size={60}
              color={Colors.white}
            />
          </View>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </Animated.View>
      </View>

      <Animated.View 
        entering={FadeIn}
        style={styles.footer}
      >
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentPage === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialCommunityIcons 
            name="arrow-right" 
            size={20} 
            color={Colors.white}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideContent: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.tintColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray,
  },
  paginationDotActive: {
    backgroundColor: Colors.tintColor,
    width: 20,
  },
  nextButton: {
    backgroundColor: Colors.tintColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 