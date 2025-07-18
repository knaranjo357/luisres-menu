import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Star, Sparkles, Utensils, Coffee } from 'lucide-react';
import { MenuItem as MenuItemType } from '../types';
import { formatPrice } from '../utils/dateUtils';

interface MenuItemProps {
  item: MenuItemType;
  onOpenModal: () => void;
  index?: number;
}

// Optimized skeleton loading component
const MenuItemSkeleton: React.FC = () => (
  <div className="bg-cream rounded-3xl overflow-hidden shadow-luxury border-2 border-gold/10 animate-pulse">
    <div className="aspect-[4/3] bg-wood-light/20" />
    <div className="p-6">
      <div className="h-6 bg-wood-light/20 rounded-xl mb-4" />
      <div className="h-4 bg-wood-light/10 rounded-lg mb-2" />
      <div className="h-4 bg-wood-light/10 rounded-lg w-3/4 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gold/20 rounded-full" />
        <div className="h-6 w-20 bg-gold/20 rounded-full" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 w-24 bg-green-100 rounded-full" />
        <div className="h-6 w-16 bg-wood-light/10 rounded-full" />
      </div>
    </div>
  </div>
);

const OptimizedMenuItem: React.FC<MenuItemProps> = memo(({ item, onOpenModal, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = item.url_imagen || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg';
  
  const isFood = item.categorias.some(cat => 
    ['almuerzo', 'cena', 'platos', 'principales', 'entradas', 'sopas'].includes(cat.toLowerCase())
  );
  const isDrink = item.categorias.some(cat => 
    ['bebidas', 'jugos', 'gaseosas', 'agua', 'hicopores'].includes(cat.toLowerCase())
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Super fast animations - reduced significantly
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.15, // Reduced from 0.2
        ease: "easeOut"
      }
    },
    hover: { 
      y: -4, // Reduced from -8
      scale: 1.01, // Reduced from 1.02
      transition: { duration: 0.1, ease: "easeOut" } // Much faster
    }
  };
  
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.99 }} // Faster tap animation
      className={`group cursor-pointer ${!item.disponible ? 'opacity-75' : ''}`}
      onClick={onOpenModal}
    >
      <div className="bg-cream rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-xl transition-shadow duration-200 relative border-2 border-gold/10 hover:border-gold/30">
        
        {/* Premium badge for special items */}
        {item.valor > 25000 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05, duration: 0.1 }} // Much faster
            className="absolute top-4 left-4 z-10"
          >
            <div className="bg-gold text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-glow border border-gold/30">
              <Sparkles size={14} />
              Premium
            </div>
          </motion.div>
        )}
        
        {/* Category badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.02, duration: 0.1 }} // Much faster
          className="absolute top-4 right-4 z-10"
        >
          <div className="bg-white/90 backdrop-blur-sm text-wood-dark px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/50">
            {isFood ? (
              <Utensils size={10} className="text-wood-dark" />
            ) : isDrink ? (
              <Coffee size={10} className="text-wood-dark" />
            ) : (
              <Star size={10} className="text-wood-dark" />
            )}
            <Sparkles size={12} />
            <span>{isFood ? 'Plato' : isDrink ? 'Bebida' : 'Especial'}</span>
          </div>
        </motion.div>
        
        {/* Optimized image container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-wood-light/10">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-wood-light/20 animate-pulse" />
          )}
          
          <img 
            src={imageUrl}
            alt={item.nombre}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Availability overlay */}
          {!item.disponible && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-red-500 text-white text-sm font-bold py-3 px-6 rounded-2xl shadow-luxury border-2 border-red-400">
                ⚠️ No Disponible
              </div>
            </div>
          )}
          
          {/* Fast price badge animation */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.03, duration: 0.1 }} // Much faster
            className="absolute bottom-4 right-4"
          >
            <div className="bg-cream/95 backdrop-blur-sm text-wood-dark font-bold px-4 py-2.5 rounded-2xl shadow-luxury border-2 border-gold/30 group-hover:border-gold/50 transition-colors duration-200">
              <span className="text-base">{formatPrice(item.valor)}</span>
            </div>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start gap-3 mb-4">
            <h3 className="text-lg font-bold text-wood-dark font-title leading-tight group-hover:text-gold transition-colors duration-200 line-clamp-2">
              {item.nombre}
            </h3>
          </div>
          
          <p className="text-wood-medium mb-4 line-clamp-2 leading-relaxed text-sm">
            {item.descripcion}
          </p>
          
          {/* Categories with faster animation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.categorias.slice(0, 2).map((cat, catIndex) => (
              <motion.span 
                key={cat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: catIndex * 0.01, duration: 0.1 }} // Much faster
                className="text-xs bg-gold/20 text-gold px-3 py-1.5 rounded-full capitalize font-medium border border-gold/30 hover:bg-gold/30 transition-colors duration-150"
              >
                <CheckCircle2 size={12} className="mr-1.5" />
              </motion.span>
            ))}
            {item.categorias.length > 2 && (
              <span className="text-xs text-wood-medium font-medium">
                +{item.categorias.length - 2} más
              </span>
            )}
          </div>
          
          {/* Status and features */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {item.disponible ? (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.04, duration: 0.1 }} // Much faster
                  className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full border border-green-200"
                >
                  <CheckCircle2 size={14} className="mr-1.5" />
                  <span>Disponible</span>
                </motion.div>
              ) : (
                <div className="flex items-center text-red-600 text-sm font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  <AlertCircle size={14} className="mr-1.5" />
                  <span>Agotado</span>
                </div>
              )}
            </div>
            
            {item.para_llevar && (
              <div className="flex items-center text-wood-medium text-xs bg-wood-light/10 px-2 py-1 rounded-full">
                <Clock size={10} className="mr-1" />
                <span>Para llevar</span>
              </div>
            )}
          </div>
          
          {/* Fast hover effect indicator */}
          <div className="pt-4 border-t border-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <p className="text-gold font-bold text-sm text-center bg-gold/10 py-2 px-4 rounded-xl border border-gold/20">
              ✨ Toca para personalizar tu pedido
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OptimizedMenuItem.displayName = 'OptimizedMenuItem';

export default OptimizedMenuItem;
export { MenuItemSkeleton };