import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SubScreenHeader from "@/components/SubScreenHeader";

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  value?: string;
  type: 'toggle' | 'link' | 'info';
  onPress?: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleAppearance = () => {
    Alert.alert('Coming Soon', 'Theme customization will be available in the next update!');
  };

  const handleLanguage = () => {
    Alert.alert('Coming Soon', 'Language options will be available in the next update!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About ShareVest',
      'ShareVest is your trusted companion for Shariah-compliant investments. We help you make informed investment decisions aligned with Islamic principles.\n\nVersion 1.0.0'
    );
  };

  const settings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      icon: 'bell-outline',
      type: 'toggle',
      value: pushNotifications ? 'On' : 'Off',
      onPress: () => setPushNotifications(!pushNotifications)
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: 'palette-outline',
      value: 'Dark',
      type: 'link',
      onPress: handleAppearance
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'translate',
      value: 'English',
      type: 'link',
      onPress: handleLanguage
    },
    {
      id: 'about',
      title: 'About ShareVest',
      icon: 'information-outline',
      type: 'link',
      onPress: handleAbout
    },
    {
      id: 'version',
      title: 'App Version',
      icon: 'cellphone-cog',
      value: '1.0.0',
      type: 'info'
    }
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader title="Settings" />

      <ScrollView style={styles.content}>
        {settings.map((setting) => (
          <TouchableOpacity 
            key={setting.id}
            style={styles.settingItem}
            onPress={setting.onPress}
            disabled={setting.type === 'info'}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons 
                name={setting.icon as any}
                size={24} 
                color={Colors.white} 
              />
              <Text style={styles.settingTitle}>{setting.title}</Text>
            </View>
            <View style={styles.settingRight}>
              {setting.type === 'toggle' ? (
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: Colors.gray, true: Colors.tintColor }}
                  thumbColor={Colors.white}
                />
              ) : (
                <>
                  {setting.value && (
                    <Text style={styles.settingValue}>{setting.value}</Text>
                  )}
                  {setting.type === 'link' && (
                    <MaterialCommunityIcons 
                      name="chevron-right" 
                      size={24} 
                      color={Colors.white} 
                    />
                  )}
                </>
              )}
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    color: Colors.white,
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 14,
  },
}); 