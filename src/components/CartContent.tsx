import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateItemPrice } from '../utils/dateUtils';
import { CartItem } from '../types';

interface CartContentProps {
  onCheckout: () => void;
}

const CartContent: React.FC<CartContentProps> = ({ onCheckout }) => {
  const { items, removeFromCart, updateQuantity, updateNotes } = useCart();
  const cartTotal = items.reduce((sum, item) => sum + calculateItemPrice(item), 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-4">
          {items.map(item => {
            const itemPrice = calculateItemPrice(item);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-wood-dark">{item.nombre}</h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="text-sm text-wood-medium font-semibold mt-1">
                    {formatPrice(itemPrice)}
                    {item.precio_adicional_llevar && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        +{formatPrice(item.precio_adicional_llevar)} para llevar
                      </span>
                    )}
                  </div>
                  
                  <textarea
                    placeholder="Notas especiales..."
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    className="mt-2 w-full text-sm p-2 border rounded focus:ring-1 focus:ring-wood-light focus:border-wood-light"
                    rows={2}
                  />
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded-full bg-wood-light/10 hover:bg-wood-light/20 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded-full bg-wood-light/10 hover:bg-wood-light/20 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="border-t bg-cream p-4 sticky bottom-0">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-wood-dark">Total:</span>
          <span className="text-lg font-bold text-wood-dark">{formatPrice(cartTotal)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-wood-dark text-cream py-3 px-4 rounded-lg font-semibold hover:bg-wood-medium transition-colors flex items-center justify-center gap-2"
        >
          Continuar Pedido
        </button>
      </div>
    </div>
  );
};

export default CartContent;