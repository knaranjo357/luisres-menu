import React, { useState } from 'react';
import { ShoppingBag, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatWhatsAppMessage, restaurantConfig } from '../utils/dateUtils';
import { CustomerInfo } from '../types';
import CartContent from './CartContent';
import CheckoutForm from './CheckoutForm';

const Cart: React.FC = () => {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'efectivo',
    deliveryType: 'delivery'
  });

  const handleWhatsAppOrder = () => {
    const deliveryPrice = customerInfo.deliveryType === 'delivery' ? 5000 : 0;
    const message = formatWhatsAppMessage(items, customerInfo, deliveryPrice);
    window.open(
      `https://wa.me/${restaurantConfig.info.whatsapp}?text=${message}`,
      '_blank'
    );
    setIsOpen(false);
    setStep('cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setStep('cart');
            }
          }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-cream flex flex-col h-full"
          >
            <div className="p-4 border-b sticky top-0 bg-cream z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {step === 'checkout' && (
                    <button
                      onClick={() => setStep('cart')}
                      className="p-2 hover:bg-wood-light/10 rounded-full transition-colors"
                    >
                      <ArrowLeft size={24} className="text-wood-dark" />
                    </button>
                  )}
                  <h3 className="text-xl font-semibold text-wood-dark font-title">
                    {step === 'cart' ? 'Tu Pedido' : 'Finalizar Pedido'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setStep('cart');
                  }}
                  className="text-wood-dark/60 hover:text-wood-dark transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {step === 'cart' && (
                <CartContent onCheckout={() => setStep('checkout')} />
              )}
              {step === 'checkout' && (
                <CheckoutForm
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                  onBack={() => setStep('cart')}
                  onSubmit={handleWhatsAppOrder}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-40 ${
          items.length > 0
            ? 'bg-wood-dark text-cream hover:bg-wood-medium'
            : 'bg-wood-dark/50 text-cream/50 cursor-not-allowed'
        } p-3 rounded-full shadow-lg transition-all`}
        disabled={items.length === 0}
      >
        <ShoppingBag size={24} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {items.length}
          </span>
        )}
      </motion.button>
    </AnimatePresence>
  );
};

export default Cart;