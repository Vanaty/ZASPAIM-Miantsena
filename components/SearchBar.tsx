import { Theme } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  theme: Theme;
}

export default function SearchBar({ value, onChangeText, theme }: SearchBarProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.searchBackground }]}>
      <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher un employé…"
        placeholderTextColor={theme.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 1,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
});