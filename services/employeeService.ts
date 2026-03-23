import NetInfo from '@react-native-community/netinfo';
import { Category, Employee } from '@/types/employee';
import { StorageUtils } from '@/utils/storage';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EMPLOYEES_COLLECTION = 'employees';
const CATEGORY_COLLECTION = 'categories';


export const EmployeeService = {
  async getEmployees(): Promise<Employee[]> {
    try {
      const netInfo = await NetInfo.fetch();
      
      if (netInfo.isConnected) {
        // Fetch from Firebase when online
        // For simplicity, returning mock data here
        // In a real app, you would fetch from Firestore like below:
        const snapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION));
        const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.name.trim().localeCompare(b.name.trim())) as Employee[];

        await StorageUtils.saveEmployees(employees);
        return employees;
      } else {
        // Load from local storage when offline
        const cachedEmployees = await StorageUtils.getEmployees();
        return cachedEmployees.length > 0 ? cachedEmployees : [];
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      const cachedEmployees = await StorageUtils.getEmployees();
      return cachedEmployees.length > 0 ? cachedEmployees : [];
    }
  },

  async getCategories(): Promise<Category[]> {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return await StorageUtils.getCategories() ?? [];
    }
    const snapshot = await getDocs(collection(db, CATEGORY_COLLECTION));
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
    await StorageUtils.saveCategories(categories);
    return categories;
  },

  getSubcategories(categories: Category[], categoryName: string): string[] {
    const selectedCategory = categories.find(c => c.name.includes(categoryName) && categoryName !== '');
    console.log('Selected Category for Subcategories:', selectedCategory);
    if (!selectedCategory) return [];
    return selectedCategory?.subcategories?.map(sub => sub.trim()) || [];
  },

  getLocations(employees: Employee[]): string[] {
    return Array.from(new Set(employees.filter(emp => emp.location !== '').map(emp => emp.location))).sort();
  }
};