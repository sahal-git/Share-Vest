import { StatusBar, StyleSheet, View } from "react-native";
import React from "react";
import { Tabs, usePathname } from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
  const pathname = usePathname();
  const showFade = pathname !== "/profile";

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors.gray,
            position: "absolute",
            bottom: 40,
            justifyContent: "center",
            alignSelf: "center",
            height: 63,
            marginHorizontal: 80,
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingBottom: 40,
            paddingTop: 10,
            borderRadius: 40,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: "#333",
            borderTopColor: "#333",
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 8,
            zIndex: 100,
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#999",
          tabBarActiveTintColor: Colors.white,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  paddingTop: 12,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                  backgroundColor: focused ? Colors.tintColor : Colors.gray,
                }}
              >
                <SimpleLineIcons
                  name="home"
                  size={18}
                  color={color}
                  style={{ marginLeft: 1, marginBottom: 15 }}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  paddingTop: 12,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                  backgroundColor: focused ? Colors.tintColor : Colors.gray,
                }}
              >
                <SimpleLineIcons
                  name="book-open"
                  size={18}
                  color={color}
                  style={{ marginLeft: 1, marginBottom: 15 }}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="stocks"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  paddingTop: 12,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                  backgroundColor: focused ? Colors.tintColor : Colors.gray,
                }}
              >
                <SimpleLineIcons
                  name="graph"
                  size={18}
                  color={color}
                  style={{ marginLeft: 1, marginBottom: 15 }}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  paddingTop: 12,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 50,
                  height: 50,
                  backgroundColor: focused ? Colors.tintColor : Colors.gray,
                }}
              >
                <FontAwesome
                  name="user-o"
                  size={18}
                  color={color}
                  style={{ marginLeft: 1, marginBottom: 15 }}
                />
              </View>
            ),
          }}
        />
      </Tabs>

      {showFade && (
        <LinearGradient
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.7)",
            "rgba(0,0,0,1)",
          ]}
          style={styles.fadeEffect}
          pointerEvents="none"
        />
      )}
      <StatusBar barStyle="light-content" backgroundColor={Colors.black} />
    </View>
  );
}

const styles = StyleSheet.create({
  fadeEffect: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
});
