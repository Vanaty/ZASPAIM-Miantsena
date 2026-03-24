import { Employee } from '@/types/employee';
import { Theme } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Linking, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface EmployeeCardProps {
  employee: Employee;
  theme: Theme;
  delay: number;
  showFilters?: boolean;
  onFilterPress?: () => void;
}

export default function EmployeeCard({ employee, theme, delay, showFilters, onFilterPress }: EmployeeCardProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1);
  const filterHeight = useSharedValue(0);
  const filterOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleCall = () => {
    scale.value = withSpring(0.98, { duration: 150 }, () => {
      scale.value = withSpring(1, { duration: 150 });
    });
    
    Linking.openURL(`tel:${employee.contact}`).catch((err) =>
      console.error('Error opening phone app:', err)
    );
  };

  const toggleFilters = () => {
    setIsFilterExpanded(!isFilterExpanded);
    if (!isFilterExpanded) {
      filterHeight.value = withTiming(120, { duration: 300 });
      filterOpacity.value = withTiming(1, { duration: 300 });
    } else {
      filterHeight.value = withTiming(0, { duration: 300 });
      filterOpacity.value = withTiming(0, { duration: 300 });
    }
    onFilterPress?.();
  };

  const filterAnimatedStyle = useAnimatedStyle(() => ({
    height: filterHeight.value,
    opacity: filterOpacity.value,
  }));

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const handleShareContact = async () => {
    try {
      await Share.share({
        message: `${employee.name} - ${employee.contact}`,
      });
    } catch (error) {
      console.error('Error sharing contact:', error);
    }
  };

  const generateColor = (s: string) => {
    if (s && typeof s === "string") {
      let cumulatedCharCode = 0;
      for (let i = 0; i < s.length; i++) {
        cumulatedCharCode += s.charCodeAt(i);
      }
      const hue = (-(cumulatedCharCode * 10) + 360) % 360;
      return `hsl(${hue}, 80%, 90%)`;
    }
    
    return "#E2E8F0"; // Gris par défaut
  };
  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.profileBlock}>
          <View style={[styles.avatar, { backgroundColor: generateColor(employee.name) }]}>
            <Text style={[styles.avatarText, { color: theme.text }]}>{getInitials(employee.name)}</Text>
          </View>

          <View style={styles.nameSection}>
            <Text style={[styles.name, { color: theme.text }]}>
              {employee.name}
            </Text>

            <View style={[styles.jobBadge, { backgroundColor: theme.primaryLight }]}> 
              <Ionicons name="briefcase" size={11} color={theme.primary} />
              <Text style={[styles.job, { color: theme.primary }]}>
                {employee.job}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {showFilters && (
            <TouchableOpacity
              style={[
                styles.filterButton, 
                { 
                  backgroundColor: isFilterExpanded ? theme.primary : theme.surface,
                  borderColor: theme.border 
                }
              ]}
              onPress={toggleFilters}
            >
              <Ionicons 
                name={isFilterExpanded ? "filter" : "filter-outline"} 
                size={16} 
                color={isFilterExpanded ? "white" : theme.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      { employee.location && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={14} color="#ef4444" />
            <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
              {employee.location}
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.metaRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          {employee.category} {employee.subcategory && `| ${employee.subcategory}`}
        </Text>
      </View>

      {!!employee.remarks && (
        <Text style={[styles.remarks, { color: theme.textSecondary }]}>
          {employee.remarks}
        </Text>
      )}
      {!!employee.contact && employee.contact.length >= 10 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.callButton, { backgroundColor: theme.primary }]}
            onPress={handleCall}
            activeOpacity={0.85}
          >
            <Ionicons name="call" size={16} color="white" />
            <Text style={styles.callButtonText}>
              Appeler ({`${employee.contact.slice(0,3)} ${employee.contact.slice(3,5)} ${employee.contact.slice(5,8)} ${employee.contact.slice(8)}`})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.primary, backgroundColor: theme.card }]}
            onPress={handleShareContact}
            activeOpacity={0.85}
          >
            <Ionicons name="copy-outline" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>
      )}
      {showFilters && (
        <Animated.View style={[styles.filterPanel, filterAnimatedStyle]}>
          <Text style={[styles.filterPanelText, { color: theme.textSecondary }]}>Filtres rapides</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '500',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    flexShrink: 1,
  },
  jobBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
    maxWidth: '100%',
  },
  job: {
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
    paddingBottom: 2,
    flexWrap: 'wrap',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    flexWrap: 'wrap',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    flexWrap: 'wrap',
  },
  remarks: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  callButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  secondaryButton: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPanel: {
    overflow: 'hidden',
  },
  filterPanelText: {
    fontSize: 12,
    marginTop: 4,
  },
});