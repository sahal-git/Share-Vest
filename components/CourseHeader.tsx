import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Courses</Text>
        <View style={styles.titleSeperationLine}></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  wrapper: {
    flexDirection: "column",
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  titleSeperationLine: {
    width: 50,
    height: 2,
    backgroundColor: Colors.tintColor,
  },
});
