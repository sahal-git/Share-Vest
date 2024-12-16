import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import { useCourses } from "@/context/CourseContext";
import { CourseType } from "@/types";

export default function VideoScreen() {
  const router = useRouter();
  const { id, chapter: chapterId } = useLocalSearchParams<{
    id: string;
    chapter: string;
  }>();
  const { courses, isLoading, error, isEnrolled } = useCourses();
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      const foundCourse = courses.find((c) => c.id === Number(id));
      setCurrentCourse(foundCourse || null);
    } catch (error) {
      console.error('Error setting course:', error);
    }
  }, [id, courses]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  useEffect(() => {
    if (currentCourse && !isEnrolled(currentCourse.id)) {
      router.push({
        pathname: '/(screens)/enroll',
        params: { id: currentCourse.id.toString() }
      });
    }
  }, [currentCourse, isEnrolled, router]);

  const currentChapter = currentCourse?.chapters?.find(
    (ch) => ch.id === Number(chapterId)
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.tintColor} />
      </View>
    );
  }

  if (error || !currentCourse || !currentChapter) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          {error || 'Content not found'}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchCourse}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleChapterPress = (nextChapterId: number) => {
    router.setParams({ 
      id: currentCourse.id.toString(), 
      chapter: nextChapterId.toString() 
    });
  };

  const getVimeoId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:vimeo.com\/)(\d+)/);
    return match ? match[1] : null;
  };

  const vimeoId = getVimeoId(currentChapter.videoUrl);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.videoContainer}>
        {vimeoId ? (
          <WebView
            style={styles.video}
            source={{
              uri: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
            }}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Text style={styles.noVideoText}>No video available</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chapterHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.courseTitle}>{currentCourse.name}</Text>
            <Text style={styles.chapterTitle}>{currentChapter.title}</Text>
          </View>
        </View>

        <View style={styles.chaptersContainer}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          {currentCourse.chapters.map((chapter) => (
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
    flex: 1,
    backgroundColor: 'black',
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
  noVideoContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVideoText: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.7,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: Colors.tintColor,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});
