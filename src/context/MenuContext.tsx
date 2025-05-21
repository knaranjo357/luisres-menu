import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchMenuItems } from '../api/menuApi';
import { MenuItem } from '../types';

interface MenuContextProps {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  categories: string[];
  setSelectedCategory: (category: string | null) => void;
  filteredItems: MenuItem[];
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        setLoading(true);
        const data = await fetchMenuItems();
        
        // Sort items alphabetically by name
        const sortedData = [...data].sort((a, b) => 
          a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        
        setMenuItems(sortedData);
        
        // Sort categories alphabetically
        const allCategories = data.flatMap(item => item.categorias);
        const uniqueCategories = [...new Set(allCategories)].sort((a, b) => 
          a.localeCompare(b, 'es', { sensitivity: 'base' })
        );
        setCategories(uniqueCategories);
      } catch (error) {
        setError('Error al cargar el menú. Por favor, intente nuevamente.');
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    getMenuItems();
  }, []);

  const filteredItems = menuItems.filter(item => {
    return selectedCategory ? item.categorias.includes(selectedCategory) : true;
  });

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        error,
        selectedCategory,
        categories,
        setSelectedCategory,
        filteredItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextProps => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};