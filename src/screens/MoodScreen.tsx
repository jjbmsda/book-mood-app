import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MoodChip from "../components/MoodChip";
import colors from "../theme/colors";
import { MoodType } from "../data/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Mood">;

const MOODS: MoodType[] = [
  "설레요",
  "우울해요",
  "힐링이 필요해요",
  "심심해요",
  "집중하고 싶어요",
];

const MoodScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleNext = () => {
    if (!selectedMood) return;
    navigation.navigate("Platform", { mood: selectedMood });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>오늘 기분은 어떤가요?</Text>
        <Text style={styles.subtitle}>기분에 맞는 책을 추천해볼게요.</Text>

        <View style={styles.moodContainer}>
          {MOODS.map((mood) => (
            <MoodChip
              key={mood}
              label={mood}
              selected={selectedMood === mood}
              onPress={() => setSelectedMood(mood)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedMood && styles.nextButtonDisabled,
          ]}
          disabled={!selectedMood}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>다음 (플랫폼 선택)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  moodContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  nextButton: {
    marginTop: "auto",
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextButtonDisabled: { backgroundColor: "#9CA3AF" },
  nextButtonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});

export default MoodScreen;
