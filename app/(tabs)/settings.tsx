import { useTheme } from '@/contexts/ThemeContext';
import { darkTheme, lightTheme } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Paramètres</Text>
      </View>

      <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            {isDarkMode ? (
              <Ionicons name="moon" size={24} color={theme.text} style={styles.settingIcon} />
            ) : (
              <Ionicons name="sunny" size={24} color={theme.text} style={styles.settingIcon} />
            )}
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Mode sombre</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Basculer entre le thème clair et sombre
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDarkMode ? 'white' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Version de l'application: 2025.09
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Dernière mise à jour: Septembre 2025
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  settingCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  infoCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
});