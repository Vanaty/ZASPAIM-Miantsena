import { Category, Employee } from '@/types/employee';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const EMPLOYEES_KEY = 'employees_data';
const THEME_KEY = 'is_dark_mode';

export const StorageUtils = {

  async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem('categories_data');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem('categories_data', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  },

  async saveEmployees(employees: Employee[]): Promise<void> {
    try {
      await AsyncStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
    } catch (error) {
      console.error('Error saving employees:', error);
    }
  },

  async getEmployees(): Promise<Employee[]> {
    try {
      const data = await AsyncStorage.getItem(EMPLOYEES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading employees:', error);
      return [];
    }
  },

  async saveTheme(isDark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  async getTheme(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(THEME_KEY);
      return data ? JSON.parse(data) : Appearance.getColorScheme() === 'dark';
    } catch (error) {
      console.error('Error loading theme:', error);
      return Appearance.getColorScheme() === 'dark';
    }
  },
};