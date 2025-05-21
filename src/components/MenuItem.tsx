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
  const imageUrl = item.url_imagen || 'https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/background.jpeg';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`bg-cream rounded-xl overflow-hidden shadow-lg transition-all cursor-pointer transform hover:shadow-2xl ${
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
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-semibold text-wood-dark font-title leading-tight">{item.nombre}</h3>
          <span className="text-base font-bold text-wood-medium whitespace-nowrap">{formatPrice(item.valor)}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.descripcion}</p>
        
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
              <span className="flex items-center text-green-600 text-xs font-medium">
                <CheckCircle2 size={16} className="mr-1" />
                Disponible
              </span>
            ) : (
              <span className="flex items-center text-red-600 text-xs font-medium">
                <AlertCircle size={16} className="mr-1" />
                Agotado
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;