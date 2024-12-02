import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

export default function VideoDurationTag({ duration }: { duration: string }) {
  return (
    <View style={styles.durationTag}>
      <Text style={styles.durationText}>{duration}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  durationTag: {
    position: 'absolute',
    bottom: 70,  // Position above the gradient
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  durationText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '500',
  },
}); 