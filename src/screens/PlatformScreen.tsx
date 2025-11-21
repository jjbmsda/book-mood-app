import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../theme/colors";
import PlatformButton from "../components/PlatformButton";
import { PlatformType } from "../data/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Platform">;

const PLATFORMS: PlatformType[] = [
  "리디북스",
  "밀리의 서재",
  "YES24",
  "교보문고",
];

const PlatformScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mood } = route.params;
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(
    null
  );

  const handleNext = () => {
    if (!selectedPlatform) return;
    navigation.navigate("Result", { mood, platform: selectedPlatform });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>어디서 읽을까요?</Text>
        <Text style={styles.subtitle}>
          자주 사용하는 전자책/서점을 골라주세요.
        </Text>

        <View style={styles.platformList}>
          {PLATFORMS.map((p) => (
            <PlatformButton
              key={p}
              label={p}
              selected={selectedPlatform === p}
              onPress={() => setSelectedPlatform(p)}
            />
          ))}
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Mood")}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryText}>기분 다시선택</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              !selectedPlatform && styles.primaryButtonDisabled,
            ]}
            disabled={!selectedPlatform}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryText}>책 추천 받기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  platformList: { marginBottom: 24 },
  bottomButtons: { marginTop: "auto" },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  secondaryText: { color: colors.textSecondary, fontSize: 14 },
  primaryButton: {
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonDisabled: { backgroundColor: "#9CA3AF" },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});

export default PlatformScreen;
