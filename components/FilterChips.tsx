import { Category } from '@/types/employee';
import { Theme } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface FilterChipsProps {
  categories: Category[];
  subcategories: string[];
  locations: string[];
  selectedCategory: string;
  selectedSubcategory: string;
  selectedLocation: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
  theme: Theme;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function FilterChips({
  categories,
  subcategories,
  locations,
  selectedCategory,
  selectedSubcategory,
  selectedLocation,
  onCategoryChange,
  onSubcategoryChange,
  onLocationChange,
  onClearFilters,
  theme,
}: FilterChipsProps) {
  const hasActiveFilters = selectedCategory || selectedSubcategory || selectedLocation;
  const ChipComponent = ({ 
    label, 
    isSelected, 
    onPress, 
    disabled = false 
  }: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
    disabled?: boolean;
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      if (disabled) return;
      scale.value = withSpring(0.95, { duration: 150 }, () => {
        scale.value = withSpring(1, { duration: 150 });
      });
      onPress();
    };

    return (
      <AnimatedTouchableOpacity
        style={[
          styles.chip,
          animatedStyle,
          {
            backgroundColor: isSelected ? theme.chipSelected : theme.chipBackground,
            borderColor: theme.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: isSelected ? theme.chipSelectedText : theme.chipText,
              fontWeight: isSelected ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Asa</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {categories.map((category) => (
            <ChipComponent
              key={category.name}
              label={category.name}
              isSelected={selectedCategory === category.name}
              onPress={() => onCategoryChange(selectedCategory === category.name ? '' : category.name)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Sokajy</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {subcategories.map((subcategory) => (
              <ChipComponent
                key={subcategory}
                label={subcategory}
                isSelected={selectedSubcategory === subcategory}
                onPress={() => onSubcategoryChange(selectedSubcategory === subcategory ? '' : subcategory)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Locations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Toerana</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {locations.map((location) => (
            <ChipComponent
              key={location}
              label={location}
              isSelected={selectedLocation === location}
              onPress={() => onLocationChange(selectedLocation === location ? '' : location)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <TouchableOpacity style={[styles.clearButton, { borderColor: theme.border }]} onPress={onClearFilters}>
          <Ionicons name="close" size={16} color={theme.textSecondary} />
          <Text style={[styles.clearButtonText, { color: theme.textSecondary }]}>Effacer filtres</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 4,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 1,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
  },
  chipText: {
    fontSize: 14,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    marginLeft: 4,
  },
});