import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import colors from "../theme/colors";
import BookCard from "../components/BookCard";
import { Book } from "../data/types";
import { fetchRecommendations } from "../api/books";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

const ResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mood, platform } = route.params;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecommendations(mood, platform);
        if (isMounted) {
          setBooks(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("추천을 불러오는 중 오류가 발생했어요.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [mood, platform]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.smallLabel}>{platform} · 오늘의 추천</Text>

        <Text style={styles.mainTitle}>
          <Text>“</Text>
          <Text style={styles.moodHighlight}>{mood}</Text>
          <Text>” 기분에 맞는 책을 추천했어요</Text>
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Mood")}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryText}>기분 다시선택</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Platform", { mood })}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryText}>플랫폼 다시선택</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>책을 열심히 찾는 중이에요…</Text>
          </View>
        )}

        {error && !loading && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && (
          <View style={styles.list}>
            {books.length === 0 ? (
              <Text style={styles.emptyText}>
                아직 이 조합에 맞는 책을 못 찾았어요.{"\n"}
                다른 기분이나 플랫폼을 선택해볼까요?
              </Text>
            ) : (
              books.map((b) => <BookCard key={b.id} book={b} />)
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 20 },
  smallLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  mainTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  moodHighlight: { color: colors.accentGreen },
  buttonRow: { flexDirection: "row", marginBottom: 16 },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  secondaryText: { fontSize: 13, color: colors.textSecondary },
  list: { marginTop: 4 },
  emptyText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  center: { alignItems: "center", marginTop: 20 },
  loadingText: { marginTop: 8, fontSize: 13, color: colors.textSecondary },
  errorText: { marginTop: 16, fontSize: 14, color: "#DC2626" },
});

export default ResultScreen;
