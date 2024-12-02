import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

export default function FeaturedTag() {
  return (
    <View style={styles.featuredTag}>
      <Text style={styles.featuredText}>Featured</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
    opacity: 0.9,
  },
  featuredText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
}); 