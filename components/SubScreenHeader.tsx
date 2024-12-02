import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SubScreenHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.screenTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.black,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
}); 