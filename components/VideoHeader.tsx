import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface VideoHeaderProps {
  title: string;
  inFullscreen?: boolean;
}

export default function VideoHeader({ title, inFullscreen }: VideoHeaderProps) {
  const router = useRouter();

  if (inFullscreen) return null;

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={Colors.white}
        />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
}); 