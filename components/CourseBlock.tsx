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
import { LinearGradient } from 'expo-linear-gradient';
import FeaturedTag from './FeaturedTag';
import VideoDurationTag from './VideoDurationTag';
import { useRouter } from "expo-router";

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

  const filteredCourses = courseList.filter((course) => {
    if (text === "Your") {
      return course.enrolled;
    }
    if (category) {
      return course.category === category;
    }
    return true;
  });

  const renderItem: ListRenderItem<CourseType> = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          width: 240,
          height: 135,
          borderRadius: 10,
          marginRight: 15,
        }}
        onPress={() => router.push('/(screens)/CourseWatch')}
      >
        <View style={styles.courseContainer}>
          {showTags && item.featured && <FeaturedTag />}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.courseImage}
          />
          {item.duration && <VideoDurationTag duration={item.duration} />}
          {showEnrolled && item.enrolled && (
            <View style={styles.enrolledTag}>
              <Text style={styles.enrolledText}>Enrolled</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ gap: 15, marginTop: 15 }}>
      <Text style={{ color: Colors.white, fontSize: 16 }}>
        {text}{" "}
        {textBold && <Text style={{ fontWeight: "bold" }}>{textBold}</Text>}
      </Text>
      <FlatList
        data={filteredCourses}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  courseContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    overflow: "hidden",
    position: "relative",
  },
  courseImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  courseTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  enrolledTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    zIndex: 1,
  },
  enrolledText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
