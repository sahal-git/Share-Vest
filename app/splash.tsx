import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function Splash() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.ease,
    });
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 90,
    });

    // Navigate after splash
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.black, Colors.tintColor + '20', Colors.black]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View style={[styles.content, animatedStyle]}>
        <Image 
          source={require('@/assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ShareVest</Text>
        <Text style={styles.subtitle}>
          Your Journey to{'\n'}
          Halal Investments
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: -height * 0.5,
    left: -width * 0.5,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 24,
  },
  title: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 28,
  },
}); 