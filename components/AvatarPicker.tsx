import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AvatarPickerProps {
  selectedAvatar?: string;
  onPickImage: () => void;
}

export default function AvatarPicker({ selectedAvatar, onPickImage }: AvatarPickerProps) {
  return (
    <View style={styles.container}>
      {selectedAvatar ? (
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={onPickImage}
        >
          <Image 
            source={{ uri: selectedAvatar }} 
            style={styles.avatar} 
          />
          <View style={styles.editButton}>
            <MaterialCommunityIcons 
              name="camera" 
              size={18} 
              color={Colors.white} 
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.pickImageButton}
          onPress={onPickImage}
        >
          <MaterialCommunityIcons 
            name="camera-plus" 
            size={32} 
            color={Colors.white} 
          />
          <Text style={styles.pickImageText}>Add Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  pickImageButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.tintColor,
    borderStyle: 'dashed',
  },
  pickImageText: {
    color: Colors.white,
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.tintColor,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.black,
  },
});