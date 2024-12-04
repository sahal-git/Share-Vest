import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Colors from "@/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import CourseList from "@/data/courses.json";
import { useCourses } from "@/context/CourseContext";
import { setStatusBarHidden } from 'expo-status-bar';
import VideoHeader from "@/components/VideoHeader";

export default function VideoScreen() {
  const router = useRouter();
  const [inFullscreen, setInFullscreen] = useState(false);
  const videoRef = useRef<Video>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const { id, chapter: chapterId } = useLocalSearchParams<{
    id: string;
    chapter: string;
  }>();
  const { isEnrolled } = useCourses();

  // Find the course and current chapter
  const course = CourseList.find((c) => c.id === Number(id));
  const currentChapter = course?.chapters?.find(
    (ch) => ch.id === Number(chapterId)
  );

  useEffect(() => {
    // Check enrollment
    if (course && !isEnrolled(course.id)) {
      router.push({
        pathname: "/(screens)/enroll",
        params: { id: course.id.toString() },
      });
    }
  }, [course, id]);

  const enterFullscreen = async () => {
    setStatusBarHidden(true, 'fade');
    setInFullscreen(true);
  };

  const exitFullscreen = async () => {
    setStatusBarHidden(false, 'fade');
    setInFullscreen(false);
  };

  const handleChapterPress = useCallback(
    (nextChapterId: number) => {
      router.setParams({
        id: course?.id.toString(),
        chapter: nextChapterId.toString(),
      });
    },
    [course, router]
  );

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

      {/* Video Section */}
      <View style={styles.videoSection}>
        {/* Custom Header */}
        <VideoHeader 
          title={currentChapter.title}
          inFullscreen={inFullscreen}
        />

        {/* Video Player */}
        <View style={styles.videoContainer}>
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: ResizeMode.CONTAIN,
              source: {
                uri: currentChapter?.videoUrl || 
                  "https://media.w3.org/2010/05/sintel/trailer.mp4",
              },
              ref: videoRef,
            }}
            fullscreen={{
              inFullscreen,
              enterFullscreen,
              exitFullscreen,
            }}
            style={{
              videoBackgroundColor: 'black',
              height: inFullscreen ? screenHeight : 220,
              width: screenWidth,
            }}
            slider={{
              visible: true,
              minimumTrackTintColor: Colors.tintColor,
              maximumTrackTintColor: Colors.gray,
              thumbTintColor: Colors.tintColor,
            }}
            timeVisible={true}
            textStyle={{
              color: Colors.white,
              fontSize: 12,
            }}
          />
        </View>
      </View>

      {/* Content */}
      {!inFullscreen && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Course Info */}
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.name}</Text>
            <Text style={styles.chapterTitle}>{currentChapter.title}</Text>
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
                      chapter.id === currentChapter.id && styles.activeChapterText,
                    ]}
                  >
                    {chapter.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  videoSection: {
    backgroundColor: Colors.black,
  },
  videoContainer: {
    width: '100%',
    backgroundColor: Colors.black,
  },
  courseInfo: {
    padding: 20,
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
