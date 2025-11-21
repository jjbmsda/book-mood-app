import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import colors from "../theme/colors";
import { MoodType } from "../data/types";

interface Props {
  label: MoodType;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const MoodChip: React.FC<Props> = ({ label, selected, onPress, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, selected && styles.selected, style]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.white,
    fontWeight: "600",
  },
});

export default MoodChip;
