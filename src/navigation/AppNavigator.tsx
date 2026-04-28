import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ProfessorNavigator from './ProfessorNavigator';
import CoordinatorDashboardScreen from '../screens/Coordinator/CoordinatorDashboardScreen';
import PrivacyScreen from '../screens/PrivacyScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  AlunoApp: undefined;
  ProfessorApp: undefined;
  CoordinatorApp: undefined;
  Privacy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AlunoApp" component={TabNavigator} />
      <Stack.Screen name="ProfessorApp" component={ProfessorNavigator} />
      <Stack.Screen name="CoordinatorApp" component={CoordinatorDashboardScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}
