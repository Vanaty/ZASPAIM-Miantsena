import { StorageUtils } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect } from "react";

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;

}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        StorageUtils.getTheme().then((savedTheme) => {
            setIsDarkMode(savedTheme);
        });
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        StorageUtils.saveTheme(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{ isDarkMode, toggleTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}