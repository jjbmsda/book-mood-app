import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { PlatformType } from "../data/types";

interface Props {
  label: PlatformType;
  selected?: boolean;
  onPress?: () => void;
}

const PlatformButton: React.FC<Props> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, selected && styles.selected]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 10,
    alignItems: "center",
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: "600",
  },
});

export default PlatformButton;
