import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

interface UserData {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    avatar: "https://i.pravatar.cc/150?img=57"
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to change your profile picture!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setUserData(prev => ({ ...prev, avatar: base64Image }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  const handleAuth = async () => {
    try {
      setError(''); // Clear previous errors
      
      // Validate fields
      if (!userData.email || !userData.password || (!isLogin && !userData.name)) {
        setError('Please fill in all fields');
        return;
      }

      if (isLogin) {
        // Login
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.email === userData.email && parsedData.password === userData.password) {
            await AsyncStorage.setItem('profileData', JSON.stringify({
              name: parsedData.name,
              email: parsedData.email,
              phone: "+91 9876543210",
              avatar: parsedData.avatar || "https://i.pravatar.cc/150?img=56"
            }));
            router.replace("/(tabs)");
          } else {
            setError('Invalid email or password');
          }
        } else {
          setError('User not found');
        }
      } else {
        // Register
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setError('Registration successful! Please login.');
        setIsLogin(true);
        setUserData({
          name: '',
          email: '',
          password: '',
          avatar: "https://i.pravatar.cc/150?img=56"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[Colors.black, Colors.tintColor + '20', Colors.black]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.logoSection}>
        <Image 
          source={require("@/assets/images/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ShareVest</Text>
        <Text style={styles.subtitle}>
          Your Trusted Partner in{'\n'}
          Halal Investments
        </Text>
      </View>

      <View style={styles.formSection}>
        {error ? (
          <Text style={[
            styles.errorText, 
            error.includes('successful') && styles.successText
          ]}>
            {error}
          </Text>
        ) : null}

        {!isLogin && (
          <>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: userData.avatar }} 
                  style={styles.avatar}
                />
                <TouchableOpacity 
                  style={styles.editAvatarButton}
                  onPress={pickImage}
                >
                  <MaterialCommunityIcons 
                    name="camera" 
                    size={20} 
                    color={Colors.white} 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.changePhotoText}>Add Profile Photo</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={Colors.white + '80'}
              value={userData.name}
              onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
            />
          </>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={Colors.white + '80'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={userData.email}
          onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.white + '80'}
          secureTextEntry
          value={userData.password}
          onChangeText={(text) => setUserData(prev => ({ ...prev, password: text }))}
        />

        <TouchableOpacity 
          style={styles.authButton}
          onPress={handleAuth}
        >
          <Text style={styles.authButtonText}>
            {isLogin ? 'Login' : 'Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchButtonText}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our{" "}
          <Text style={styles.link}>Terms of Service</Text>
          {" "}and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: -height * 0.5,
    left: -width * 0.5,
    transform: [{ rotate: '45deg' }],
  },
  logoSection: {
    alignItems: "center",
    marginTop: height * 0.08,
    marginBottom: height * 0.04,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  formSection: {
    paddingHorizontal: 32,
    width: '100%',
  },
  input: {
    backgroundColor: Colors.gray + '80',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: Colors.white,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: Colors.tintColor,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.tintColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  switchButton: {
    padding: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    color: Colors.tintColor,
    fontSize: 14,
  },
  terms: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  link: {
    color: Colors.tintColor,
    textDecorationLine: "underline",
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.tintColor,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.black,
  },
  changePhotoText: {
    color: Colors.tintColor,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: Colors.tintColor,
    backgroundColor: `${Colors.tintColor}20`,
  },
}); 