import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import colors from "../theme/colors";
import { Book } from "../data/types";

interface Props {
  book: Book;
}

const BookCard: React.FC<Props> = ({ book }) => {
  const handleOpenLink = () => {
    if (book.link) {
      Linking.openURL(book.link);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: book.coverImage }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <View style={styles.tagsRow}>
            {book.tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.desc} numberOfLines={3}>
        {book.description}
      </Text>

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
};

const styles = StyleSheet.create({
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
  row: {
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
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  author: {
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
  desc: {
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
    backgroundColor: "#FF0000", // OTT 예고편 버튼 빨간 원 느낌
    marginRight: 8,
  },
  previewText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
});

export default BookCard;
