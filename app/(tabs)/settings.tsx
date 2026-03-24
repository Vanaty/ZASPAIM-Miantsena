import { useTheme } from '@/contexts/ThemeContext';
import { darkTheme, lightTheme } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();

  const theme = isDarkMode ? darkTheme : lightTheme;
  const currentYear = new Date().getFullYear();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: theme.primaryLight }]}> 
            <Ionicons name="settings" size={20} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Paramètres</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}> 
              Personnalisez votre expérience
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>APPARENCE</Text>

        <View style={[styles.settingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={toggleTheme}
            activeOpacity={0.85}
            accessibilityRole="switch"
            accessibilityState={{ checked: isDarkMode }}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.iconWrap, { backgroundColor: theme.primaryLight }]}> 
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={18}
                  color={theme.primary}
                />
              </View>

              <View style={styles.settingTextBlock}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Mode sombre</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}> 
                  Basculer entre le thème clair et sombre
                </Text>
              </View>
            </View>

            <View style={styles.switchArea}>
              <Text style={[styles.stateBadge, { color: theme.primary, backgroundColor: theme.primaryLight }]}> 
                {isDarkMode ? 'Actif' : 'Inactif'}
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={isDarkMode ? 'white' : '#f4f3f4'}
              />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>INFORMATIONS</Text>

        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Version</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>2026.03</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Dernière mise à jour</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>Mars 2026</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Copyright</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>© {currentYear}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionLabel: {
    paddingHorizontal: 18,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  settingCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 22,
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
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextBlock: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  switchArea: {
    alignItems: 'flex-end',
  },
  stateBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 8,
    overflow: 'hidden',
  },
  infoCard: {
    marginHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
});