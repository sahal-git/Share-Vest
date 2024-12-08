import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { capitalizeWords } from '@/utils/text';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=4CAF50&color=fff';

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  const capitalizedName = capitalizeWords(firstName);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userInfoWrapper}>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.avatarContainer}
          >
            <Image
              source={{ uri: user.avatar || DEFAULT_AVATAR }}
              style={styles.userImg}
            />
            <View style={styles.avatarBorder} />
          </TouchableOpacity>

          <View style={styles.userTextWrapper}>
            <Text style={[styles.userText, styles.greeting]}>
              Hello, {capitalizedName}
            </Text>
            <Text style={[styles.userText, styles.appName]}>
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
  avatarContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: Colors.tintColor,
  },
  userTextWrapper: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  appName: {
    fontSize: 16,
  },
  userText: {
    color: Colors.white,
  },
  textBold: {
    fontWeight: "bold",
  },
  btn: {
    borderColor: Colors.white,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  btnText: {
    color: Colors.white,
    fontSize: 12,
  },
});
