import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, Star, Clock, Utensils, Coffee, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/dateUtils';
import { useCart } from '../context/CartContext';

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { addToCart } = useCart();

  const isFood = item.categorias.some(cat => 
    ['almuerzo', 'cena', 'platos', 'principales', 'entradas', 'sopas'].includes(cat.toLowerCase())
  );
  const isDrink = item.categorias.some(cat => 
    ['bebidas', 'jugos', 'gaseosas', 'agua', 'hicopores'].includes(cat.toLowerCase())
  );

  const totalPrice = item.valor * quantity;
  const takeawayPrice = item.precio_adicional_llevar && item.precio_adicional_llevar > 0 
    ? item.precio_adicional_llevar * quantity 
    : 0;

  const handleAddToCart = () => {
    addToCart({ ...item, isForTakeaway: true }, quantity, notes);
    onClose();
    setQuantity(1);
    setNotes('');
  };

  const resetAndClose = () => {
    setQuantity(1);
    setNotes('');
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={resetAndClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-full sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-full sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-t-3xl sm:rounded-3xl bg-gradient-to-br from-cream to-cream-light shadow-luxury-xl transition-all border-2 border-gold/20 max-h-screen flex flex-col">
                {/* Header optimizado */}
                <div className="relative flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetAndClose}
                    className="absolute right-4 top-4 z-10 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-150 shadow-lg border border-white/20"
                  >
                    <X size={20} />
                  </motion.button>

                  {/* Imagen optimizada */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={item.url_imagen || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Premium badge con animación rápida */}
                    {item.valor > 25000 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-4 left-4"
                      >
                        <div className="bg-gradient-to-r from-gold to-gold/90 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-glow">
                          <Sparkles size={16} />
                          Premium
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50">
                        {isFood ? (
                          <Utensils size={18} className="text-wood-dark" />
                        ) : isDrink ? (
                          <Coffee size={18} className="text-wood-dark" />
                        ) : (
                          <Star size={18} className="text-wood-dark" />
                        )}
                        <span className="text-sm font-bold text-wood-dark">
                          {isFood ? 'Plato Principal' : isDrink ? 'Bebida' : 'Especial'}
                        </span>
                      </div>
                    </div>

                    {/* Availability badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                        item.disponible 
                          ? 'bg-green-500/90 text-white border border-green-400' 
                          : 'bg-red-500/90 text-white border border-red-400'
                      }`}>
                        {item.disponible ? '✅ Disponible' : '❌ Agotado'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content scrollable optimizado */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Title and description */}
                    <div>
                      <Dialog.Title className="text-3xl font-bold text-wood-dark mb-4 font-title leading-tight">
                        {item.nombre}
                      </Dialog.Title>
                      
                      {item.descripcion && (
                        <p className="text-wood-medium leading-relaxed text-lg">
                          {item.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Categories con animación rápida */}
                    <div className="flex flex-wrap gap-2">
                      {item.categorias.slice(0, 4).map((cat, index) => (
                        <motion.span 
                          key={cat}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02, duration: 0.1 }}
                          className="text-sm bg-gradient-to-r from-gold/20 to-gold/10 text-gold px-4 py-2 rounded-full capitalize font-bold border border-gold/30 hover:from-gold/30 hover:to-gold/20 transition-all duration-150"
                        >
                          {cat}
                        </motion.span>
                      ))}
                      {item.categorias.length > 4 && (
                        <span className="text-sm text-wood-medium px-4 py-2 font-medium">
                          +{item.categorias.length - 4} más
                        </span>
                      )}
                    </div>

                    {/* Quantity and Add to Cart optimizado */}
                    <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 border-2 border-gold/30 shadow-inner space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-wood-dark">Precio:</span>
                        <span className="text-3xl font-bold text-wood-dark">
                          {formatPrice(item.valor)}
                        </span>
                      </div>
                      
                      {takeawayPrice > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Clock size={20} className="text-amber-600" />
                            <span className="text-lg font-bold text-amber-700">Recargo para llevar</span>
                          </div>
                          <p className="text-amber-700 font-semibold">
                            +{formatPrice(item.precio_adicional_llevar!)} por unidad
                          </p>
                        </motion.div>
                      )}

                      {/* Quantity selector optimizado */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-wood-dark text-lg">Cantidad:</span>
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-2 border-2 border-wood-light/30 shadow-lg">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-3 rounded-xl bg-gradient-to-r from-wood-light/20 to-wood-light/10 hover:from-wood-light/30 hover:to-wood-light/20 transition-all duration-150 shadow-md"
                          >
                            <Minus size={18} className="text-wood-dark" />
                          </motion.button>
                          <span className="font-bold text-2xl w-16 text-center text-wood-dark">
                            {quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-3 rounded-xl bg-gradient-to-r from-wood-light/20 to-wood-light/10 hover:from-wood-light/30 hover:to-wood-light/20 transition-all duration-150 shadow-md"
                          >
                            <Plus size={18} className="text-wood-dark" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Total calculation */}
                      <div className="border-t-2 border-gold/30 pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-wood-dark text-lg">
                            <span className="font-semibold">Subtotal ({quantity}x):</span>
                            <span className="font-bold">{formatPrice(totalPrice)}</span>
                          </div>
                          {takeawayPrice > 0 && (
                            <div className="flex justify-between text-wood-dark text-lg">
                              <span className="font-semibold">Recargo para llevar:</span>
                              <span className="font-bold">{formatPrice(takeawayPrice)}</span>
                            </div>
                          )}
                          <div className="border-t-2 border-gold/30 pt-3">
                            <div className="flex justify-between text-2xl font-bold text-wood-dark">
                              <span>Total:</span>
                              <span className="text-gold">{formatPrice(totalPrice + takeawayPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Add to cart button optimizado */}
                      <motion.button
                        whileHover={item.disponible ? { scale: 1.02, y: -2 } : {}}
                        whileTap={item.disponible ? { scale: 0.98 } : {}}
                        onClick={handleAddToCart}
                        disabled={!item.disponible}
                        className={`w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-4 shadow-luxury border-2 ${
                          item.disponible
                            ? 'bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white hover:shadow-glow-strong border-gold/30 transform hover:scale-[1.02]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-200'
                        }`}
                      >
                        {item.disponible ? (
                          <>
                            <Plus size={24} />
                            <span>Agregar al Pedido</span>
                            <Sparkles size={20} />
                          </>
                        ) : (
                          <>
                            <X size={24} />
                            <span>No Disponible</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Notes optimizado */}
                    <div>
                      <label className="block text-lg font-bold text-wood-dark mb-3">
                        Notas especiales (opcional)
                      </label>
                      <textarea
                        placeholder="¿Alguna preferencia especial? Ej: sin cebolla, extra salsa, término de la carne..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-4 border-2 border-wood-light/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none transition-all duration-150 shadow-inner text-lg"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MenuItemModal;