import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Colors from "@/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import CourseList from "@/data/courses.json";
import { useCourses } from "@/context/CourseContext";

type Chapter = {
  id: number;
  title: string;
  videoUrl: string;
}

export default function VideoScreen() {
  const router = useRouter();
  const { id, chapter: chapterId } = useLocalSearchParams<{
    id: string;
    chapter: string;
  }>();
  const { isEnrolled } = useCourses();
  const [isPortrait, setIsPortrait] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState(Number(chapterId));

  // Find the course and current chapter
  const course = CourseList.find((c) => c.id === Number(id));
  const currentChapter = course?.chapters?.find(
    (ch) => ch.id === currentVideoId
  );

  // Memoize the chapter change handler
  const handleChapterPress = useCallback((nextChapterId: number) => {
    const nextChapter = course?.chapters?.find(ch => ch.id === nextChapterId);
    if (nextChapter) {
      setCurrentVideoId(nextChapterId);
      // Update URL without triggering navigation
      router.setParams({ chapter: nextChapterId.toString() }, { replace: true });
    }
  }, [course, router]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    // Check if user is enrolled
    if (course && !isEnrolled(course.id)) {
      router.replace(`/(screens)/enroll?id=${course.id}`);
    }
  }, [course, id]);

  if (!course || !currentChapter) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Content not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <VideoPlayer
          videoProps={{
            shouldPlay: true,
            resizeMode: ResizeMode.CONTAIN,
            source: {
              uri: currentChapter.videoUrl,
            },
          }}
          style={{
            videoBackgroundColor: 'black',
            height: undefined,
            width: undefined,
          }}
          slider={{
            visible: true,
          }}
          timeVisible={true}
          defaultControlsVisible={true}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chapter Title */}
        <View style={styles.chapterHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.courseTitle}>{course.name}</Text>
            <Text style={styles.chapterTitle}>{currentChapter.title}</Text>
          </View>
        </View>

        {/* Chapters List */}
        <View style={styles.chaptersContainer}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          {course.chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              style={[
                styles.chapterCard,
                chapter.id === currentChapter.id && styles.activeChapter,
              ]}
              onPress={() => handleChapterPress(chapter.id)}
            >
              <View style={styles.chapterInfo}>
                <MaterialCommunityIcons
                  name={
                    chapter.id === currentChapter.id
                      ? "play-circle"
                      : "play-circle-outline"
                  }
                  size={24}
                  color={
                    chapter.id === currentChapter.id
                      ? Colors.tintColor
                      : Colors.white
                  }
                />
                <Text
                  style={[
                    styles.chapterText,
                    chapter.id === currentChapter.id &&
                      styles.activeChapterText,
                  ]}
                >
                  {chapter.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
  },
  courseTitle: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 4,
  },
  chapterTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  chaptersContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  chapterCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.gray,
  },
  activeChapter: {
    backgroundColor: Colors.gray + "80",
    borderColor: Colors.tintColor,
    borderWidth: 1,
  },
  chapterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chapterText: {
    color: Colors.white,
    fontSize: 15,
    flex: 1,
  },
  activeChapterText: {
    color: Colors.tintColor,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.7,
  },
});
