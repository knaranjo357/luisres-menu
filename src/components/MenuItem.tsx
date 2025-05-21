import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { MenuItem as MenuItemType } from '../types';
import { formatPrice } from '../utils/dateUtils';

interface MenuItemProps {
  item: MenuItemType;
  onOpenModal: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onOpenModal }) => {
  const imageUrl = item.url_imagen || '/images/background.jpeg';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`bg-cream rounded-lg overflow-hidden shadow-md transition-all cursor-pointer transform hover:shadow-xl ${
        !item.disponible ? 'opacity-70' : ''
      }`}
      onClick={onOpenModal}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.nombre}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        
        {!item.disponible && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg">
              No Disponible
            </span>
          </div>
        )}
        
        {item.para_llevar && item.disponible && (
          <div className="absolute top-2 right-2 bg-green-600/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md backdrop-blur-sm">
            Para llevar
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-base font-semibold text-wood-dark font-title leading-tight">{item.nombre}</h3>
          <span className="text-sm font-bold text-wood-medium whitespace-nowrap">{formatPrice(item.valor)}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{item.descripcion}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {item.categorias.map(cat => (
              <span 
                key={cat} 
                className="text-xs bg-wood-light/10 text-wood-dark px-2 py-0.5 rounded-full capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {item.disponible ? (
              <>
                <span className="flex items-center text-green-600 text-xs">
                  <CheckCircle2 size={12} className="mr-0.5" />
                  <span className="hidden sm:inline">Disponible</span>
                </span>
                <ShoppingBag size={14} className="text-wood-medium" />
              </>
            ) : (
              <span className="flex items-center text-red-600 text-xs">
                <AlertCircle size={12} className="mr-0.5" />
                <span className="hidden sm:inline">Agotado</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;