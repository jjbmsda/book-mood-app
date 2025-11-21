import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";

const colors = {
  primary: "#0064FF",
  primaryLight: "#E5F0FF",
  background: "#F5F7FA",
  text: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
  accentGreen: "#16A34A",
};

// Joseph 맥북 IP로 설정 (백엔드 Flask 서버 주소)
const BASE_URL = "http://172.29.122.165:5000";

const MOODS = [
  "설레요",
  "우울해요",
  "힐링이 필요해요",
  "심심해요",
  "집중하고 싶어요",
];
const PLATFORMS = ["리디북스", "밀리의 서재", "YES24", "교보문고"];

type Book = {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  link?: string;
  tags?: string[];
};

async function fetchRecommendations(
  mood: string,
  platform: string,
  limit = 10
) {
  const params = new URLSearchParams({
    mood,
    platform,
    limit: String(limit),
  }).toString();

  const res = await fetch(`${BASE_URL}/recommendations?${params}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const json = await res.json();
  return (json.books || []) as Book[];
}

export default function App() {
  const [step, setStep] = useState<"mood" | "platform" | "result">("mood");
  const [mood, setMood] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToPlatformStep = () => {
    if (!mood) return;
    setStep("platform");
  };

  const goToResultStep = async () => {
    if (!mood || !platform) return;
    setStep("result");
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendations(mood, platform);
      setBooks(data);
    } catch (e) {
      setError("추천을 불러오는 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const resetMood = () => {
    setMood(null);
    setPlatform(null);
    setBooks([]);
    setError(null);
    setStep("mood");
  };

  const resetPlatform = () => {
    setPlatform(null);
    setBooks([]);
    setError(null);
    setStep("platform");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {step === "mood" && (
          <>
            <Text style={styles.title}>오늘 기분은 어떤가요?</Text>
            <Text style={styles.subtitle}>기분에 맞는 책을 추천해볼게요.</Text>

            <View style={styles.moodContainer}>
              {MOODS.map((m) => (
                <MoodChip
                  key={m}
                  label={m}
                  selected={mood === m}
                  onPress={() => setMood(m)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                !mood && styles.primaryButtonDisabled,
              ]}
              disabled={!mood}
              onPress={goToPlatformStep}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryText}>다음 (플랫폼 선택)</Text>
            </TouchableOpacity>
          </>
        )}

        {step === "platform" && (
          <>
            <Text style={styles.title}>어디서 읽을까요?</Text>
            <Text style={styles.subtitle}>
              자주 사용하는 전자책/서점을 골라주세요.
            </Text>

            <View style={styles.platformList}>
              {PLATFORMS.map((p) => (
                <PlatformButton
                  key={p}
                  label={p}
                  selected={platform === p}
                  onPress={() => setPlatform(p)}
                />
              ))}
            </View>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={resetMood}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryText}>기분 다시선택</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  !platform && styles.primaryButtonDisabled,
                ]}
                disabled={!platform}
                onPress={goToResultStep}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryText}>책 추천 받기</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === "result" && (
          <>
            <Text style={styles.smallLabel}>{platform} · 오늘의 추천</Text>

            <Text style={styles.mainTitle}>
              <Text>“</Text>
              <Text style={styles.moodHighlight}>{mood}</Text>
              <Text>” 기분에 맞는 책을 추천했어요</Text>
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={resetMood}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryText}>기분 다시선택</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={resetPlatform}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryText}>플랫폼 다시선택</Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                  책을 열심히 찾는 중이에요…
                </Text>
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── 작은 컴포넌트들 ─────────────────────────

type MoodChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function MoodChip({ label, selected, onPress }: MoodChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.moodChip, selected && styles.moodChipSelected]}
    >
      <Text
        style={[styles.moodChipText, selected && styles.moodChipTextSelected]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type PlatformButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function PlatformButton({ label, selected, onPress }: PlatformButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.platformButton, selected && styles.platformButtonSelected]}
    >
      <Text
        style={[
          styles.platformButtonText,
          selected && styles.platformButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type BookCardProps = {
  book: Book;
};

function BookCard({ book }: BookCardProps) {
  const handleOpenLink = () => {
    if (book.link) {
      Linking.openURL(book.link);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Image source={{ uri: book.coverImage }} style={styles.cover} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{book.title}</Text>
          <Text style={styles.cardAuthor}>{book.author}</Text>
          <View style={styles.tagsRow}>
            {(book.tags || []).map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {book.description ? (
        <Text style={styles.cardDesc} numberOfLines={3}>
          {book.description}
        </Text>
      ) : null}

      {book.link ? (
        <TouchableOpacity
          style={styles.previewButton}
          onPress={handleOpenLink}
          activeOpacity={0.85}
        >
          <View style={styles.previewIconCircle} />
          <Text style={styles.previewText}>상세 페이지 열기 (네이버 도서)</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── 스타일 ─────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  moodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: 8,
    marginBottom: 8,
  },
  moodChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  moodChipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  moodChipTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: "auto",
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  platformList: {
    marginBottom: 24,
  },
  platformButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 10,
    alignItems: "center",
  },
  platformButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  platformButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  platformButtonTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  bottomButtons: {
    marginTop: "auto",
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  smallLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  moodHighlight: {
    color: colors.accentGreen,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  list: {
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  center: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    color: "#DC2626",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  cover: {
    width: 72,
    height: 108,
    borderRadius: 8,
    backgroundColor: "#D1D5DB",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  cardAuthor: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.background,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  previewIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FF0000",
    marginRight: 8,
  },
  previewText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
});
