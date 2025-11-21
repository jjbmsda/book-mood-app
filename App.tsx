import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoodScreen from "./src/screens/MoodScreen";
import PlatformScreen from "./src/screens/PlatformScreen";
import ResultScreen from "./src/screens/ResultScreen";
import { MoodType, PlatformType } from "./src/data/types";

export type RootStackParamList = {
  Mood: undefined;
  Platform: { mood: MoodType };
  Result: { mood: MoodType; platform: PlatformType };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Mood"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Mood" component={MoodScreen} />
        <Stack.Screen name="Platform" component={PlatformScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
