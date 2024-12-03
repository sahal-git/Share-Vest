import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { Video, ResizeMode } from 'expo-av';
import SubScreenHeader from "@/components/SubScreenHeader";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Chapter {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
}

interface CourseDetails {
  title: string;
  instructor: string;
  totalDuration: string;
  totalChapters: number;
  completedChapters: number;
  description: string;
  chapters: Chapter[];
}

const courseDetails: CourseDetails = {
  title: "Introduction to Islamic Finance",
  instructor: "Dr. Ahmed Khan",
  totalDuration: "4h 30m",
  totalChapters: 12,
  completedChapters: 3,
  description: "Learn the fundamentals of Islamic finance and investment principles. This comprehensive course covers Shariah-compliant investment strategies, understanding halal stocks, and ethical investment practices.",
  chapters: [
    {
      id: 1,
      title: "Introduction to Islamic Finance Principles",
      duration: "15:30",
      isCompleted: true
    },
    {
      id: 2,
      title: "Understanding Shariah Compliance",
      duration: "20:45",
      isCompleted: true
    },
    {
      id: 3,
      title: "Halal Investment Strategies",
      duration: "25:15",
      isCompleted: true
    },
    {
      id: 4,
      title: "Stock Screening Methods",
      duration: "18:20",
      isCompleted: false
    },
    // Add more chapters...
  ]
};

export default function VideoScreen() {
  const video = React.useRef(null);
  const [activeChapter, setActiveChapter] = React.useState(courseDetails.chapters[0]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title={courseDetails.title} />
      
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://cdn.pixabay.com/video/2024/03/15/204306-923909642_large.mp4'
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay
      />

      <ScrollView style={styles.content}>
        {/* Course Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Course Progress</Text>
            <Text style={styles.progressText}>
              {courseDetails.completedChapters}/{courseDetails.totalChapters} Chapters
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(courseDetails.completedChapters/courseDetails.totalChapters) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Course Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.white} />
            <Text style={styles.infoText}>{courseDetails.totalDuration}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="book-outline" size={20} color={Colors.white} />
            <Text style={styles.infoText}>{courseDetails.totalChapters} Chapters</Text>
          </View>
        </View>

        {/* Chapters */}
        <View style={styles.chaptersSection}>
          <Text style={styles.sectionTitle}>Chapters</Text>
          {courseDetails.chapters.map((chapter) => (
            <TouchableOpacity 
              key={chapter.id}
              style={[
                styles.chapterItem,
                activeChapter.id === chapter.id && styles.activeChapter
              ]}
              onPress={() => setActiveChapter(chapter)}
            >
              <View style={styles.chapterLeft}>
                {chapter.isCompleted ? (
                  <MaterialCommunityIcons name="check-circle" size={24} color={Colors.tintColor} />
                ) : (
                  <View style={styles.chapterNumber}>
                    <Text style={styles.chapterNumberText}>{chapter.id}</Text>
                  </View>
                )}
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterDuration}>{chapter.duration}</Text>
                </View>
              </View>
              {activeChapter.id === chapter.id && (
                <MaterialCommunityIcons name="play-circle" size={24} color={Colors.tintColor} />
              )}
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
  videoWrapper: {
    width: width,
    aspectRatio: 16/9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  videoInfo: {
    marginBottom: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  stats: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: Colors.white,
    fontSize: 12,
  },
  instructorSection: {
    marginBottom: 16,
  },
  instructorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tintColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  instructorTitle: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
  descriptionSection: {
    paddingTop: 16,
  },
  description: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
  progressSection: {
    padding: 16,
    backgroundColor: Colors.gray,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    color: Colors.white,
    opacity: 0.7,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.tintColor,
    borderRadius: 2,
  },
  infoSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: Colors.white,
    opacity: 0.7,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chaptersSection: {
    marginBottom: 24,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.gray,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeChapter: {
    backgroundColor: Colors.tintColor + '20',
    borderColor: Colors.tintColor,
    borderWidth: 1,
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  chapterNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  chapterDuration: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 12,
  },
}); 