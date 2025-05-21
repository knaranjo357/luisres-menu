import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus } from 'lucide-react';
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

  const totalPrice = item.valor + (item.precio_adicional_llevar || 0);

  const handleAddToCart = () => {
    addToCart({ ...item, isForTakeaway: true }, quantity, notes);
    onClose();
    setQuantity(1);
    setNotes('');
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-cream p-6 shadow-xl transition-all">
                <div className="relative">
                  <button
                    onClick={onClose}
                    className="absolute right-0 top-0 text-wood-dark hover:text-wood-medium"
                  >
                    <X size={24} />
                  </button>

                  <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.url_imagen || '/images/background.jpeg'}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <Dialog.Title className="text-2xl font-bold text-wood-dark mb-2 font-title">
                    {item.nombre}
                  </Dialog.Title>

                  <p className="text-wood-medium mb-4">{item.descripcion}</p>

                  {item.para_llevar && item.precio_adicional_llevar && (
                    <div className="mb-4 bg-amber-50 p-3 rounded-lg">
                      <p className="text-amber-700 font-medium">
                        Recargo para llevar: +{formatPrice(item.precio_adicional_llevar)}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-bold text-wood-dark">
                      {formatPrice(totalPrice)}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 rounded-full bg-wood-light/10 hover:bg-wood-light/20"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 rounded-full bg-wood-light/10 hover:bg-wood-light/20"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <textarea
                    placeholder="¿Alguna nota especial? (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-wood-light"
                    rows={3}
                  />

                  <button
                    onClick={handleAddToCart}
                    disabled={!item.disponible}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      item.disponible
                        ? 'bg-wood-medium text-cream hover:bg-wood-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.disponible ? 'Agregar al Pedido' : 'No Disponible'}
                  </button>
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