import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useProfile } from '@/context/ProfileContext';
import { useWatchlist } from '@/context/WatchlistContext';
import CourseList from "@/data/courses.json";
import { CourseType } from "@/types";

export default function Profile() {
  const router = useRouter();
  const { profile } = useProfile();
  const { watchlist } = useWatchlist();
  
  // Get enrolled courses count
  const enrolledCoursesCount = CourseList.filter((course: CourseType) => 
    course.enrolled
  ).length;
  
  // Get watchlist count
  const watchlistCount = watchlist.length;
  
  // Get certificates count
  const certificatesCount = CourseList.filter((course: CourseType) => 
    course.enrolled && course.completed
  ).length;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: profile.avatar }}
                  style={styles.profileImage}
                />
                <View style={styles.imageOverlay} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.email}>{profile.email}</Text>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statsCard}>
              <MaterialCommunityIcons
                name="book-education"
                size={24}
                color={Colors.tintColor}
              />
              <Text style={styles.statsNumber}>{enrolledCoursesCount}</Text>
              <Text style={styles.statsLabel}>Enrolled Courses</Text>
            </View>
            <View style={styles.statsCard}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={Colors.tintColor}
              />
              <Text style={styles.statsNumber}>{watchlistCount}</Text>
              <Text style={styles.statsLabel}>Watchlist Stocks</Text>
            </View>
            <View style={styles.statsCard}>
              <MaterialCommunityIcons
                name="certificate"
                size={24}
                color={Colors.tintColor}
              />
              <Text style={styles.statsNumber}>{certificatesCount}</Text>
              <Text style={styles.statsLabel}>Certificates</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push("/(screens)/profile/edit")}
            >
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons
                  name="account-edit"
                  size={24}
                  color={Colors.white}
                />
                <Text style={styles.menuText}>Edit Profile</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(screens)/notifications')}
            >
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
                  color={Colors.white}
                />
                <Text style={styles.menuText}>Notifications</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(screens)/settings')}
            >
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons
                  name="cog"
                  size={24}
                  color={Colors.white}
                />
                <Text style={styles.menuText}>Settings</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color="#FF4444"
                />
                <Text style={[styles.menuText, { color: "#FF4444" }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  profileSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: Colors.tintColor,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 15,
  },
  name: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "600",
  },
  email: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsCard: {
    backgroundColor: Colors.gray,
    width: "31%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  statsNumber: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
  },
  statsLabel: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  menuSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.gray,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});
