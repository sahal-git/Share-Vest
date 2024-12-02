import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import SubScreenHeader from "@/components/SubScreenHeader";
import { useProfile } from '@/context/ProfileProvider';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EditProfile() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState(profile);

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
        setFormData(prev => ({ ...prev, avatar: base64Image }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Name is required');
        return;
      }
      await updateProfile(formData);
      router.back();
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Edit Profile" />

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: formData.avatar }} 
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
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholderTextColor={Colors.gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            placeholderTextColor={Colors.gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            placeholderTextColor={Colors.gray}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  input: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
    color: Colors.white,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.tintColor,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
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
}); 