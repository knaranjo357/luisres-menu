import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import MenuItem from './MenuItem';
import MenuItemModal from './MenuItemModal';
import { useMenu } from '../context/MenuContext';
import { isTodayMonday, restaurantConfig } from '../utils/dateUtils';
import { MenuItem as MenuItemType } from '../types';

const MenuList: React.FC = () => {
  const { filteredItems, loading, error, selectedCategory, selectedService } = useMenu();
  const isMonday = isTodayMonday() && restaurantConfig.mondayClosed;
  
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleOpenModal = (item: MenuItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  if (isMonday) {
    return (
      <div className="container mx-auto px-4 py-16" id="menu-items">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-cream p-8 rounded-lg shadow-md max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-wood-dark mb-4 font-title">
            ¡Cerrado los Lunes!
          </h2>
          <p className="text-gray-700 mb-6">
            Nuestro restaurante se encuentra cerrado los lunes para descanso del personal.
            Te esperamos a partir de mañana con nuestro delicioso menú.
          </p>
          <p className="text-sm text-wood-medium italic">
            *Si quieres ver el menú de todas formas, puedes modificar la configuración fácilmente.
          </p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" id="menu-items">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-block p-6 bg-cream rounded-lg shadow-md"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-medium mx-auto"></div>
          <p className="mt-4 text-wood-dark font-medium">Cargando menú...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" id="menu-items">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 p-6 rounded-lg shadow-md inline-block"
        >
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            className="bg-wood-medium text-white px-6 py-2 rounded-md hover:bg-wood-dark transition-colors shadow-sm hover:shadow-md"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" id="menu-items">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream p-8 rounded-lg shadow-md inline-block"
        >
          <p className="text-wood-dark text-lg mb-2">
            No hay platillos disponibles 
            {selectedCategory ? ` en la categoría "${selectedCategory}"` : ''} 
            para el servicio de {selectedService === 'almuerzo' ? 'almuerzo' : 'cena'}.
          </p>
          <p className="text-wood-medium text-sm">
            Por favor, selecciona otra categoría o servicio.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" id="menu-items" ref={ref}>
      <motion.h2 
        className="text-2xl md:text-3xl font-bold text-wood-dark mb-6 font-title text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {selectedCategory ? (
          <span className="capitalize">{selectedCategory}</span>
        ) : (
          'Nuestro Menú'
        )}
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {filteredItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onOpenModal={() => handleOpenModal(item)}
          />
        ))}
      </motion.div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MenuList;