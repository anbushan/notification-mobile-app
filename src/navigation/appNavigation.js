import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen.js";
import OnboardingScreen from "../screens/OnboardingScreen.js";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getItem } from "../utils/asyncStorage.js";
import NotificationScreen from "../screens/Notification.js";
import SettingsScreen from "../screens/Settings.js";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../App.js";
import { fonts } from "../constant/fonts.js";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);
  const checkIfAlreadyOnboarded = async () => {
    try {
      let onboarded = await getItem("onboarded");
      if (onboarded !== 1 && onboarded !== null) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };
  return (
    <NavigationContainer>
      {
        showOnboarding ? (
         
      <Stack.Navigator
      initialRouteName={"BottomTab"}
    >
      <Stack.Screen
        name="BottomTab"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
        ):(
          <Stack.Navigator
          initialRouteName={"Onboarding"}
        >
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
            component={OnboardingScreen}
          />
          <Stack.Screen
            name="BottomTab"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        )
      }
    </NavigationContainer>
  );
}
function TabNavigator() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#B5D9FB",
      tabBarInactiveTintColor: "grey",
      tabBarStyle: {
        backgroundColor: "#e6e7e8",
        borderTopWidth: 0,
      },
    }}
  >
      <Tab.Screen
        name={`${t("home")}`}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarLabelStyle: {
            fontFamily: fonts.Sans.medium,
          },
          headerTitleStyle: {
            fontFamily:fonts.Sans.bold
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={`${t("notifications")}`}
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            fontFamily:fonts.Sans.bold
          },
          tabBarLabelStyle: {
            fontFamily: fonts.Sans.medium,
          },
          headerTintColor: theme.color,
        }}
      />
      <Tab.Screen
        name={`${t("settings")}`}
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            fontFamily:fonts.Sans.bold
          },
          tabBarLabelStyle: {
            fontFamily: fonts.Sans.medium,
          },
          headerTintColor: theme.color,
        }}
      />
    </Tab.Navigator>
  );
}
