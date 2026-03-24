import EmployeeCard from '@/components/EmployeeCard';
import FilterChips from '@/components/FilterChips';
import SearchBar from '@/components/SearchBar';
import { useTheme } from '@/contexts/ThemeContext';
import { EmployeeService } from '@/services/employeeService';
import { Category, Employee, FilterState } from '@/types/employee';
import { darkTheme, lightTheme } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmployeeList() {
  const flatListRef = useRef<FlatList<Employee>>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    subcategory: '',
    location: '',
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const [employeeData, categoryData] = await Promise.all([
        EmployeeService.getEmployees(),
        EmployeeService.getCategories()
      ]);
      setEmployees(employeeData);
      setCategories(categoryData);
    } catch (err) {
      setError('Impossible de charger les employés. Vérifiez votre connexion.');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.job.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = !filters.category || employee.category.includes(filters.category);
      const matchesSubcategory = !filters.subcategory || employee.subcategory.includes(filters.subcategory);
      const matchesLocation = !filters.location || employee.location === filters.location;

      return matchesSearch && matchesCategory && matchesSubcategory && matchesLocation;
    });
  }, [employees, filters]);

  const activeFilterCount = useMemo(
    () => [filters.category, filters.subcategory, filters.location].filter(Boolean).length,
    [filters.category, filters.subcategory, filters.location]
  );

  const subcategories = useMemo(() => {
    if (!filters.category || categories.length === 0) return [];
    return EmployeeService.getSubcategories(categories, filters.category);
  }, [categories, filters.category]);
  
  const locations = useMemo(() => 
    EmployeeService.getLocations(employees), 
    [employees]
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset subcategory when category changes
      if (key === 'category' && value !== prev.category) {
        newFilters.subcategory = '';
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      location: '',
    });
  };

  const handleScrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderEmployee = ({ item, index }: { item: Employee; index: number }) => (
    <EmployeeCard 
      employee={item} 
      theme={theme} 
      delay={index * 50} 
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Chargement des employés...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={() => loadEmployees()}
          >
            <Ionicons name="refresh" size={16} color="white" />
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={[styles.title, { color: theme.text }]}> 
            Asa: {`${filteredEmployees.length}`.padStart(2, '0')}
          </Text>

          <TouchableOpacity
            style={[
              styles.filterToggleButton,
              { backgroundColor: theme.chipBackground, borderColor: theme.border },
            ]}
            onPress={() => setIsFilterPanelVisible((prev) => !prev)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={isFilterPanelVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
          >
            <Ionicons
              name={isFilterPanelVisible ? 'chevron-up' : 'options-outline'}
              size={16}
              color={theme.text}
            />
            <Text style={[styles.filterToggleText, { color: theme.text }]}> 
              {activeFilterCount > 0 ? `Filtres (${activeFilterCount})` : 'Filtres'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <SearchBar
        value={filters.search}
        onChangeText={(text) => handleFilterChange('search', text)}
        theme={theme}
      />

      {isFilterPanelVisible && (
        <FilterChips
          categories={categories}
          subcategories={subcategories}
          locations={locations}
          selectedCategory={filters.category}
          selectedSubcategory={filters.subcategory}
          selectedLocation={filters.location}
          onCategoryChange={(category) => handleFilterChange('category', category)}
          onSubcategoryChange={(subcategory) => handleFilterChange('subcategory', subcategory)}
          onLocationChange={(location) => handleFilterChange('location', location)}
          onClearFilters={clearFilters}
          theme={theme}
        />
      )}

      {!isFilterPanelVisible && activeFilterCount > 0 && (
        <Text style={[styles.activeFiltersHint, { color: theme.textSecondary }]}> 
          {activeFilterCount} filtre(s) actif(s)
        </Text>
      )}

      <FlatList
        ref={flatListRef}
        data={filteredEmployees}
        renderItem={renderEmployee}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          if (y > 220 && !showScrollTopButton) {
            setShowScrollTopButton(true);
          } else if (y <= 220 && showScrollTopButton) {
            setShowScrollTopButton(false);
          }
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadEmployees(true)}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Jereo ny sivana na ny fikarohana nataonao, tsy nahitana mpiasa mifanaraka amin&apos;izany.
            </Text>
          </View>
        )}
      />

      {showScrollTopButton && (
        <TouchableOpacity
          style={[styles.scrollTopButton, { backgroundColor: theme.primary }]}
          onPress={handleScrollToTop}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Revenir en haut"
        >
          <Ionicons name="arrow-up" size={20} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeFiltersHint: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginHorizontal: 18,
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 100,
  },
  scrollTopButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});