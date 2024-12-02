import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SubScreenHeader from "@/components/SubScreenHeader";

interface Notification {
  id: number;
  type: 'stock' | 'course' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'stock',
    title: 'Stock Alert',
    message: 'HDFC Bank stock is up by 5% today',
    time: '2h ago',
    read: false,
  },
  {
    id: 2,
    type: 'course',
    title: 'Course Update',
    message: 'New module available in Islamic Finance course',
    time: '5h ago',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    title: 'Welcome!',
    message: 'Welcome to ShareVest. Start your halal investment journey.',
    time: '1d ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'stock':
        return 'chart-line';
      case 'course':
        return 'book-open-page-variant';
      case 'system':
        return 'bell';
      default:
        return 'bell';
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Notifications" />

      <ScrollView style={styles.content}>
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard
            ]}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={getIcon(notification.type)}
                size={24}
                color={Colors.tintColor}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.message}>{notification.message}</Text>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.tintColor,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 8,
  },
  time: {
    color: Colors.white,
    opacity: 0.5,
    fontSize: 12,
  },
}); 