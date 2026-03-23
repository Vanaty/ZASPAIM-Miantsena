import { Employee } from '@/types/employee';
import { Theme } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  }, [delay]);

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
        <View style={styles.nameSection}>
          <Text style={[styles.name, { color: theme.text }]}>{employee.name}</Text>
          <Text style={[styles.job, { color: theme.textSecondary }]}>{employee.job}</Text>
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
          <TouchableOpacity
            style={[styles.callButton, { backgroundColor: theme.primary }]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Localisation:</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{employee.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Catégorie:</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{employee.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Sous-catégorie:</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{employee.subcategory}</Text>
        </View>
      </View>

      {employee.remarks && (
        <View style={[styles.remarksSection, { backgroundColor: theme.surface }]}>
          <Ionicons name="document-text" size={14} color={theme.textSecondary} style={styles.remarksIcon} />
          <Text style={[styles.remarks, { color: theme.textSecondary }]}>{employee.remarks}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.contact, { color: theme.textSecondary }]}>{employee.contact}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  job: {
    fontSize: 14,
    fontWeight: '500',
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
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
    width: 100,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
  },
  remarksSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  remarksIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  remarks: {
    fontSize: 13,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  contact: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});