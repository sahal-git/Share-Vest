import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { CourseType } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCourses } from '@/context/CourseContext';

export default function CourseBlock({
  text,
  textBold,
  courseList,
  category,
  showEnrolled = true,
  showTags = true,
}: {
  text: string;
  textBold?: string;
  courseList: CourseType[];
  category?: string;
  showEnrolled?: boolean;
  showTags?: boolean;
}) {
  const router = useRouter();
  const { isEnrolled, enrolledCourses } = useCourses();

  const filteredCourses = courseList.filter((course) => {
    if (text === "Your") {
      if (enrolledCourses.length === 0) {
        return course.intro === true;
      }
      return isEnrolled(course.id);
    }
    if (category) {
      return course.category === category;
    }
    return !course.intro;
  });

  const renderItem: ListRenderItem<CourseType> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => router.push(`/(screens)/enroll?id=${item.id}`)}
      >
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
          {showEnrolled && isEnrolled(item.id) && (
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
                item.category === "Beginner" ? "school" :
                item.category === "Advanced" ? "chart-line" :
                item.category === "Trading" ? "trending-up" :
                item.category === "Portfolio" ? "briefcase" :
                "filter" // for Screening
              }
              size={24}
              color={Colors.white}
            />
          </View>
          <View style={styles.courseDetails}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.courseFooter}>
              <Text style={styles.categoryText}>
                {item.category}
              </Text>
              {item.duration && (
                <Text style={styles.durationText}>{item.duration}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {text}{" "}
        {textBold && <Text style={{ fontWeight: "bold" }}>{textBold}</Text>}
      </Text>
      <FlatList
        data={filteredCourses}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
    marginTop: 15,
  },
  headerText: {
    color: Colors.white,
    fontSize: 16,
  },
  listContent: {
    paddingRight: 20,
  },
  courseCard: {
    width: 280,
    marginLeft: 20,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 160,
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
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: "#999999",  // Light grey color
  },
  durationText: {
    color: "#999",
    fontSize: 13,
  },
});
