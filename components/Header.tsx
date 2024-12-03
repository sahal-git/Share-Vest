import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProfile } from '@/context/ProfileContext';

export default function Header() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userInfoWrapper}>
          <Image
            source={{ uri: profile.avatar }}
            style={styles.userImg}
          />

          <View style={styles.userTextWrapper}>
            <Text style={[styles.userText, { fontSize: 12 }]}>
              Hello, {profile.name}
            </Text>
            <Text style={[styles.userText, { fontSize: 16 }]}>
              <Text style={styles.textBold}>ShareVest</Text> here!
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/(screens)/watchlist')}
        >
          <MaterialCommunityIcons 
            name="bookmark" 
            size={20} 
            color={Colors.white}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.btnText}>Watchlist</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  userInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userTextWrapper: {
    marginLeft: 10,
  },
  btnWrapper: {
    borderColor: Colors.white,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  btnText: {
    color: Colors.white,
    fontSize: 12,
  },
  textBold: {
    fontWeight: "bold",
  },
  userText: {
    color: Colors.white,
  },
  btn: {
    borderColor: Colors.white,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
