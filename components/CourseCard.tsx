import { MaterialCommunityIcons } from "@expo/vector-icons";
// ... other imports

export default function CourseCard({ course }: { course: CourseType }) {
  return (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => router.push(`/(screens)/enroll/${course.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: course.imageUrl }}
          style={styles.courseImage}
        />
        {!course.published && (
          <View style={styles.comingSoonBadge}>
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={14} 
              color={Colors.white} 
            />
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
      {/* ... rest of the card content */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ... other styles
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.tintColor,
  },
  comingSoonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  // ... other styles
}); 