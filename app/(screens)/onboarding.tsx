import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AvatarPicker from '@/components/AvatarPicker';

export default function Onboarding() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string>();

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!isLogin && (!name || !phone)) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (!isLogin && !phone.match(/^\+?[\d\s-]{8,}$/)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    
    setIsLoading(true);
    try {
      let success;
      
      if (isLogin) {
        success = await signIn(email, password);
        if (!success) {
          Alert.alert('Error', 'Invalid email or password');
          return;
        }
        router.replace('/(tabs)');
      } else {
        success = await signUp(name, email, password, phone, avatar);
        if (!success) {
          Alert.alert('Error', 'Email already exists');
          return;
        }
        Alert.alert(
          'Success',
          'Account created successfully! Please login to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLogin(true);
                setPassword('');
                // Keep the email for convenience
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(1000)}
            style={styles.logoContainer}
          >
            <View style={styles.logo}>
              <MaterialCommunityIcons 
                name="chart-line" 
                size={50} 
                color={Colors.white} 
              />
            </View>
            <Text style={styles.appName}>ShareVest</Text>
            <Text style={styles.tagline}>Islamic Investment Learning</Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(1000)}
            style={styles.formContainer}
          >
            {!isLogin && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Profile Picture</Text>
                  <AvatarPicker
                    selectedAvatar={avatar}
                    onPickImage={handleImagePick}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#666"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchButtonText}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 40,
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: Colors.tintColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.7,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
    color: Colors.white,
    fontSize: 16,
    height: 55,
  },
  submitButton: {
    backgroundColor: Colors.tintColor,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    height: 55,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  switchButtonText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
}); 