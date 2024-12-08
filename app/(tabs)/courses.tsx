import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { router, Stack, useRouter } from "expo-router";
import CourseList from "@/data/courses.json";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CourseType } from "@/types";
import { useCourses } from "@/context/CourseContext";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    "Beginner",
    "Advanced",
    "Portfolio",
    "Screening",
    "Trading",
  ];

  const filteredCourses = CourseList.filter((course) => {
    const matchesSearch =
      searchQuery === "" ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const isNotIntro = !course.intro;
    return matchesSearch && matchesCategory && isNotIntro;
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {showSearch ? (
            <View style={styles.searchBar}>
              <MaterialCommunityIcons name="magnify" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Courses</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton}    
                  onPress={() => router.push('/(screens)/notifications')}
                >
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={24}
                    color={Colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowSearch(true)}
                >
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Course List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.courseList}>
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </View>
          {filteredCourses.length === 0 && (
            <Text style={styles.noResults}>No courses found</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const CourseCard = ({ course }: { course: CourseType }) => {
  const router = useRouter();
  const { isEnrolled } = useCourses();
  
  return (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => router.push(`/(screens)/enroll?id=${course.id}`)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: course.imageUrl }} style={styles.thumbnail} />
        {isEnrolled(course.id) && (
          <View style={styles.enrolledBadge}>
            <MaterialCommunityIcons
              name="check-circle"
              size={14}
              color={Colors.white}
            />
          </View>
        )}
      </View>
      <View style={styles.courseInfo}>
        <View style={styles.courseIcon}>
          <MaterialCommunityIcons
            name={
              course.category === "Beginner"
                ? "school"
                : course.category === "Advanced"
                ? "chart-line"
                : course.category === "Portfolio"
                ? "briefcase"
                : course.category === "Screening"
                ? "filter"
                : "trending-up"
            }
            size={24}
            color={Colors.white}
          />
        </View>
        <View style={styles.courseDetails}>
          <View style={styles.titleContainer}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.name}
            </Text>
            {isEnrolled(course.id) && (
              <View style={styles.enrolledTag}>
                <Text style={styles.enrolledText}>Enrolled</Text>
              </View>
            )}
          </View>
          <View style={styles.courseFooter}>
            <Text style={styles.categoryText}>{course.category}</Text>
            {course.duration && (
              <Text style={styles.durationText}>{course.duration}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    position: "relative",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  categoryScroll: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  categoryContainer: {
    gap: 10,
    paddingBottom: 35,
  },
  categoryChip: {
    backgroundColor: Colors.gray,
    paddingHorizontal: 16,
    height: 36,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedCategory: {
    backgroundColor: Colors.tintColor,
  },
  categoryText: {
    color: "#999",
    fontSize: 13,
  },
  selectedCategoryText: {
    color: Colors.white,
    opacity: 1,
    fontWeight: "500",
  },
  courseList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  courseCard: {
    marginBottom: 20,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  enrolledBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.tintColor,
    padding: 4,
    borderRadius: 12,
  },
  courseInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  courseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
  },
  courseFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  noResults: {
    color: Colors.white,
    textAlign: "center",
    marginTop: 20,
    opacity: 0.7,
  },
  durationText: {
    color: "#999",
    fontSize: 13,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    marginLeft: 8,
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  enrolledTag: {
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  enrolledText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
