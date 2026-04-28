import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9', // sky-500
        tabBarInactiveTintColor: '#94a3b8', // slate-400
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        }
      }}
    >
      <Tab.Screen 
        name="Hoje" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="map-pin" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="pie-chart" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Histórico" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="clock" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}
