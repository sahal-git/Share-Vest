import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SubScreenHeader from "@/components/SubScreenHeader";
import { CourseType } from "@/types";
import { useCourses } from "@/context/CourseContext";

// Simplify type guard
const isCourseValid = (course: CourseType | undefined): course is CourseType => {
  return !!course?.id && !!course?.name && !!course?.category;
};

export default function EnrollScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    courses, 
    isLoading, 
    error, 
    isEnrolled,
    enrollInCourse
  } = useCourses();
  
  const course = courses.find((c) => c.id === Number(id));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SubScreenHeader title="Course Details" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.tintColor} />
        </View>
      </View>
    );
  }

  if (!course || !isCourseValid(course)) {
    return (
      <View style={styles.container}>
        <SubScreenHeader title="Course Details" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Course not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => { }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const navigateToVideo = useCallback((chapterId: number) => {
    router.push({
      pathname: "(screens)/video",
      params: { 
        id: course.id, 
        chapter: chapterId 
      }
    });
  }, [course, router]);

  const handleChapterPress = (chapterId: number) => {
    if (!course) return;

    if (isEnrolled(course.id)) {
      navigateToVideo(chapterId);
    } else {
      Alert.alert(
        "Enroll Required",
        "Please enroll in this course to access the content.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Enroll Now", onPress: handleEnrollPress },
        ]
      );
    }
  };

  const handleEnrollPress = () => {
    if (!course) return;

    if (!course.published) {
      Alert.alert(
        'Coming Soon!',
        'Stay tuned! This course will be available soon.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!isEnrolled(course.id)) {
      enrollInCourse(course.id);
      // Show success alert without navigation
      Alert.alert(
        "Success!",
        "Course enrolled successfully",
        [
          {
            text: "OK",
            // Remove the navigation, just close the alert
            onPress: () => {}
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Course Details" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: course.imageUrl }}
            style={styles.courseImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.imageOverlay}
          >
            <View style={styles.courseCategory}>
              <MaterialCommunityIcons
                name={
                  course.category === "Beginner"
                    ? "school"
                    : course.category === "Advanced"
                    ? "chart-line"
                    : course.category === "Trading"
                    ? "trending-up"
                    : course.category === "Portfolio"
                    ? "briefcase"
                    : "filter"
                }
                size={16}
                color={Colors.white}
              />
              <Text style={styles.categoryText}>{course.category}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.name}</Text>
          <View style={styles.metaInfo}>
            {course.chapters && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="book-outline"
                  size={16}
                  color={Colors.tintColor}
                />
                <Text style={styles.metaText}>
                  {course.chapters.length} Chapters
                </Text>
              </View>
            )}
            {isEnrolled(course.id) && (
              <View style={styles.enrolledBadge}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={14}
                  color={Colors.white}
                />
                <Text style={styles.enrolledText}>Enrolled</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>About This Course</Text>
          <Text style={styles.description}>
            Learn about {course.category.toLowerCase()} concepts in Islamic
            finance and investment. This comprehensive course covers essential
            knowledge and practical applications for Shariah-compliant
            investing.
          </Text>

          {course.chapters && (
            <React.Fragment>
              <Text style={styles.sectionTitle}>Course Content</Text>
              {course.chapters.map((chapter) => (
                <TouchableOpacity
                  key={chapter.id}
                  style={[
                    styles.moduleCard,
                    !isEnrolled(course.id) && styles.disabledCard,
                  ]}
                  onPress={() => handleChapterPress(chapter.id)}
                >
                  <View style={styles.moduleHeader}>
                    <View style={styles.moduleInfo}>
                      <Text style={styles.moduleTitle}>{chapter.title}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={isEnrolled(course.id) ? "play-circle" : "lock"}
                      size={24}
                      color={isEnrolled(course.id) ? Colors.white : Colors.gray}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </React.Fragment>
          )}
        </View>
      </ScrollView>

      {/* Enroll Button */}
      {!isEnrolled(course.id) && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.enrollButton,
              !course.published && styles.comingSoonButton
            ]}
            onPress={handleEnrollPress}
          >
            <Text 
              style={[
                styles.enrollButtonText,
                !course.published && styles.comingSoonButtonText
              ]}
            >
              {!course.published ? "Coming Soon" : "Enroll Now"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Split styles into logical groups
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.tintColor,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  courseImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: "flex-end",
    padding: 16,
  },
  courseCategory: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 6,
  },
  categoryText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "500",
  },
  courseInfo: {
    padding: 20,
  },
  courseTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  instructorCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  instructorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  instructorDetails: {
    flex: 1,
  },
  instructorName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  instructorTitle: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 2,
  },
  instructorExp: {
    color: Colors.tintColor,
    fontSize: 13,
  },
  moduleCard: {
    backgroundColor: Colors.gray,
    borderRadius: 12,
    marginBottom: 8,
  },
  disabledCard: {
    opacity: 0.7,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  moduleInfo: {
    flex: 1,
    marginRight: 12,
  },
  moduleTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
  moduleMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  moduleMetaText: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 13,
  },
  footer: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: Colors.black,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
  },
  enrollButton: {
    backgroundColor: Colors.tintColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    opacity: 1,
  },
  comingSoonButton: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.tintColor,
  },
  enrollButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonButtonText: {
    color: Colors.tintColor,
  },
  enrolledBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    gap: 4,
  },
  enrolledText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
