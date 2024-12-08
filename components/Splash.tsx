import { StyleSheet, View, Text, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  withDelay,
  withSequence
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Splash() {
  // Animation values
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(0);

  useEffect(() => {
    // Animate logo
    scale.value = withSequence(
      withSpring(1.2, { damping: 15 }),
      withSpring(1, { damping: 12 })
    );
    opacity.value = withTiming(1, { duration: 800 });
    logoRotate.value = withSpring(360, { damping: 20 });

    // Animate text and footer with delay
    textOpacity.value = withDelay(400, withSpring(1));
    footerOpacity.value = withDelay(800, withSpring(1));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${logoRotate.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: withSpring(textOpacity.value * 0) }]
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
    transform: [{ translateY: withSpring(footerOpacity.value * 0) }]
  }));

  return (
    <View style={styles.container}>
      <AnimatedLinearGradient
        colors={[
          'rgba(76, 175, 80, 0.1)',
          'rgba(0, 0, 0, 0.8)',
          '#000000'
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <MaterialCommunityIcons 
            name="chart-line" 
            size={65} 
            color="#FFFFFF" 
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.title}>ShareVest</Text>
          <Text style={styles.subtitle}>Islamic Investment Learning</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, footerStyle]}>
        <View style={styles.line} />
        <Text style={styles.poweredBy}>
          Powered by <Text style={styles.highlight}>Saaz Dev</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  logoContainer: {
    width: 125,
    height: 125,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.75,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: width,
    gap: 16,
  },
  line: {
    width: 140,
    height: 2,
    backgroundColor: '#4CAF50',
    opacity: 0.3,
    borderRadius: 1,
  },
  poweredBy: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  highlight: {
    color: '#4CAF50',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
}); 