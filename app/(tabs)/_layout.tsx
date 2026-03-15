import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/constants/Colors';

function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    map: '🗺',
    settings: '⚙',
  };
  return <Text style={{ fontSize: 20, color }}>{icons[name] ?? '●'}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.skyBlue,
        tabBarInactiveTintColor: colors.mutedGrey,
        tabBarStyle: {
          backgroundColor: colors.deepNavy,
          borderTopColor: colors.slate,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
          headerTitle: 'Settings',
          headerStyle: { backgroundColor: colors.deepNavy },
          headerTintColor: colors.softWhite,
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
