import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchMenuItems } from '../api/menuApi';
import { MenuItem, ServiceType } from '../types';
import { isServiceAvailable, restaurantConfig } from '../utils/dateUtils';

interface MenuContextProps {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  selectedService: ServiceType;
  categories: string[];
  setSelectedCategory: (category: string | null) => void;
  setSelectedService: (service: ServiceType) => void;
  filteredItems: MenuItem[];
  retryLoading: () => void;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('almuerzo');
  const [categories, setCategories] = useState<string[]>([]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMenuItems();
      
      // Filtrar items válidos y ordenar alfabéticamente
      const validItems = data.filter(item => 
        item.nombre && 
        item.nombre.trim() !== '' &&
        item.valor > 0
      );

      const sortedData = [...validItems].sort((a, b) => 
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
      );
      
      setMenuItems(sortedData);
      
      // Extraer y ordenar categorías únicas
      const allCategories = sortedData.flatMap(item => item.categorias || []);
      const uniqueCategories = [...new Set(allCategories)]
        .filter(cat => cat && cat.trim() !== '')
        .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Error al cargar el menú. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  // Auto-switch to available service
  useEffect(() => {
    const lunchAvailable = isServiceAvailable('lunch');
    const dinnerAvailable = isServiceAvailable('dinner');

    if (restaurantConfig.autoSwitch.toLunch && !lunchAvailable && selectedService === 'almuerzo' && dinnerAvailable) {
      setSelectedService('cena');
    } else if (restaurantConfig.autoSwitch.toDinner && !dinnerAvailable && selectedService === 'cena' && lunchAvailable) {
      setSelectedService('almuerzo');
    }
  }, [selectedService]);

  const filteredItems = React.useMemo(() => {
    return menuItems.filter(item => {
      // Verificaciones básicas
      if (!item.nombre || !item.servicios || !Array.isArray(item.servicios)) {
        return false;
      }

      // Filtro por categoría
      const categoryMatch = selectedCategory ? 
        (item.categorias && item.categorias.includes(selectedCategory)) : true;
      
      // Filtro por servicio
      const serviceMatch = item.servicios.includes(selectedService);
      
      // Filtro por día de la semana
      const currentDay = new Date().getDay() || 7; // Domingo = 0, convertir a 7
      const dayMatch = item.dias && Array.isArray(item.dias) ? 
        item.dias.includes(currentDay) : true;
      
      return categoryMatch && serviceMatch && dayMatch;
    });
  }, [menuItems, selectedCategory, selectedService]);

  const retryLoading = () => {
    loadMenuItems();
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        error,
        selectedCategory,
        selectedService,
        categories,
        setSelectedCategory,
        setSelectedService,
        filteredItems,
        retryLoading,
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