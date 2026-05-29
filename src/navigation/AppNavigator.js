import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../views/theme';

import HomeScreen from '../views/screens/HomeScreen';
import LessonScreen from '../views/screens/LessonScreen';
import ProgressScreen from '../views/screens/ProgressScreen';
import SettingsScreen from '../views/screens/SettingsScreen';
import AboutScreen from '../views/screens/AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ emoji, focused }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
    <Text style={styles.tabEmoji}>{emoji}</Text>
  </View>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeTab" component={HomeScreen} />
    <Stack.Screen name="Lesson" component={LessonScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: COLORS.text },
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Lessons',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            title: 'My Progress',
            tabBarLabel: 'Progress',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="About"
          component={AboutScreen}
          options={{
            title: 'About',
            tabBarLabel: 'About',
            tabBarIcon: ({ focused }) => <TabIcon emoji="ℹ️" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    paddingBottom: 4,
    paddingTop: 4,
    height: 64,
    elevation: 8,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabIconActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabEmoji: {
    fontSize: 20,
  },
});

export default AppNavigator;
