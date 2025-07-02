import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ChefHat,
  Clock,
  Utensils,
  AlertTriangle,
  Star,
  Calendar,
  Heart,
} from 'lucide-react';
import OptimizedMenuItem from './OptimizedMenuItem';
import MenuItemModal from './MenuItemModal';
import FastCategoryFilter from './FastCategoryFilter';
import { useMenu } from '../context/MenuContext';
import {
  getRestaurantStatus,
  getNextAvailableService,
} from '../utils/dateUtils';
import { MenuItem as MenuItemType } from '../types';

const MenuList: React.FC = () => {
  const { filteredItems, loading, error, selectedCategory, selectedService } =
    useMenu();
  const restaurantStatus = getRestaurantStatus();
  const nextService = getNextAvailableService();

  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Memoize filtered items para prevenir re-renders innecesarios
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      // Items disponibles primero
      if (a.disponible && !b.disponible) return -1;
      if (!a.disponible && b.disponible) return 1;
      // Luego por precio (items premium primero)
      if (a.valor !== b.valor) return b.valor - a.valor;
      // Finalmente por nombre
      return a.nombre.localeCompare(b.nombre);
    });
  }, [filteredItems]);

  const handleOpenModal = (item: MenuItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Loading state optimizado
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16" id="menu-items">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-cream to-cream-light rounded-3xl p-16 inline-block shadow-luxury border border-gold/20">
            <motion.div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-gold/20 border-t-gold rounded-full mx-auto"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 w-20 h-20 border-4 border-gold/10 rounded-full mx-auto"
              />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChefHat size={64} className="text-gold mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-wood-dark mb-4 font-title">
                Preparando tu menú
              </h3>
              <p className="text-wood-medium text-lg">
                Seleccionando los mejores platillos de nuestra cocina...
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Restaurant closed state
  if (restaurantStatus.isClosed) {
    return (
      <div className="container mx-auto px-4 py-16" id="menu-items">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-16 max-w-3xl mx-auto shadow-luxury border-2 border-red-200">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <Clock size={80} className="text-red-500 mx-auto" />
            </motion.div>

            <div className="flex items-center justify-center gap-3 mb-6">
              {restaurantStatus.isSpecialDay ? (
                <Star size={32} className="text-gold" />
              ) : (
                <AlertTriangle size={32} className="text-red-500" />
              )}
              <h2 className="text-4xl font-bold text-red-700 font-title">
                {restaurantStatus.isSpecialDay
                  ? '🎉 Día Especial'
                  : '⚠️ Cerrado Temporalmente'}
              </h2>
              {restaurantStatus.isSpecialDay && (
                <Star size={32} className="text-gold" />
              )}
            </div>

            <p className="text-red-600 text-xl mb-8 leading-relaxed font-medium">
              {restaurantStatus.reason}
            </p>

            {nextService && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-red-200">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Calendar size={24} className="text-wood-dark" />
                  <h3 className="text-xl font-bold text-wood-dark font-title">
                    Próximo Servicio
                  </h3>
                </div>
                <p className="text-wood-dark text-lg">
                  <span className="font-semibold">
                    {nextService.service === 'lunch'
                      ? '🌅 Almuerzo'
                      : '🌙 Cena'}
                  </span>{' '}
                  el {nextService.day} de {nextService.schedule.start} a{' '}
                  {nextService.schedule.end}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-8 text-wood-medium">
              <Heart size={20} className="text-red-400" />
              <span className="font-medium">
                ¡Te esperamos pronto en Luis Res!
              </span>
              <Heart size={20} className="text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16" id="menu-items">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-12 inline-block shadow-luxury">
            <div className="text-red-600 mb-6">
              <AlertTriangle size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-red-700 mb-4 font-title">
              Error al cargar el menú
            </h3>
            <p className="text-red-600 mb-8 text-lg font-medium max-w-md mx-auto">
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-luxury hover:shadow-glow transition-all duration-200"
              onClick={() => window.location.reload()}
            >
              🔄 Reintentar
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12" id="menu-items">
      {/* Header del menú - SIEMPRE VISIBLE */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-bold text-wood-dark mb-6 font-title">
          <span className="bg-gradient-to-r from-wood-dark via-gold to-wood-dark bg-clip-text text-transparent">
            Nuestro Menú
          </span>
        </h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '120px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-1.5 bg-gradient-to-r from-gold to-gold/60 mx-auto rounded-full mb-6"
        />
        <p className="text-wood-medium text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          Descubre sabores auténticos preparados con ingredientes frescos y
          técnicas tradicionales que han sido perfeccionadas durante
          generaciones
        </p>

        {/* Service status indicator */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-50 px-4 py-2 rounded-full border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium text-sm">
              Servicio de {selectedService === 'almuerzo' ? 'Almuerzo' : 'Cena'}{' '}
              Activo
            </span>
          </div>

          {restaurantStatus.isSpecialDay && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-gold/20 to-gold/10 px-4 py-2 rounded-full border border-gold/30">
              <Star size={16} className="text-gold" />
              <span className="text-gold font-bold text-sm">Día Especial</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Category Filter */}
      <FastCategoryFilter />

      {/* Menu Items Section con ref para intersection observer */}
      <div className="mt-12" ref={ref}>
        {/* Empty state */}
        {sortedItems.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-br from-cream to-cream-light rounded-3xl p-16 max-w-3xl mx-auto shadow-luxury border border-gold/20">
              <ChefHat
                size={80}
                className="text-gold mx-auto mb-8 opacity-60"
              />
              <h3 className="text-3xl font-bold text-wood-dark mb-6 font-title">
                No hay platillos disponibles
              </h3>
              <p className="text-wood-medium text-lg mb-4 max-w-md mx-auto leading-relaxed">
                {selectedCategory
                  ? `No tenemos platillos en la categoría "${selectedCategory}" para el servicio de ${
                      selectedService === 'almuerzo' ? 'almuerzo' : 'cena'
                    }.`
                  : `No hay platillos disponibles para el servicio de ${
                      selectedService === 'almuerzo' ? 'almuerzo' : 'cena'
                    }.`}
              </p>
              <p className="text-wood-medium">
                Por favor, selecciona otra categoría o servicio.
              </p>
            </div>
          </motion.div>
        )}

        {/* Menu Items Grid optimizado */}
        {sortedItems.length > 0 && (
          <>
            {/* Results summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center mb-8"
            >
              <p className="text-wood-medium text-lg">
                <span className="font-bold text-gold">
                  {sortedItems.length}
                </span>{' '}
                platillos encontrados
                {selectedCategory && (
                  <span>
                    {' '}
                    en{' '}
                    <span className="font-semibold text-wood-dark capitalize">
                      "{selectedCategory}"
                    </span>
                  </span>
                )}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.02, // Súper rápido
                  },
                },
              }}
            >
              <AnimatePresence mode="popLayout">
                {sortedItems.map((item, index) => (
                  <OptimizedMenuItem
                    key={item.id}
                    item={item}
                    index={index}
                    onOpenModal={() => handleOpenModal(item)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <MenuItemModal
            item={selectedItem}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuList;