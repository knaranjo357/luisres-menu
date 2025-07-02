import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, MapPin, CreditCard, CheckCircle, Truck, Store, Search, DollarSign, Send } from 'lucide-react';
import { CustomerInfo } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateTotalPrice, cities, restaurantConfig } from '../utils/dateUtils';

interface CheckoutWizardProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  customerInfo,
  setCustomerInfo,
  onBack,
  onSubmit
}) => {
  const { items } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const cartTotal = calculateTotalPrice(items);
  const selectedCityData = cities.find(city => city.name === selectedCity);
  const deliveryPrice = selectedNeighborhood ? 
    selectedCityData?.neighborhoods.find(n => n.name === selectedNeighborhood)?.price || 0 : 0;

  const totalSteps = customerInfo.deliveryType === 'delivery' ? 4 : 3;

  // Filtrar y ordenar barrios alfabéticamente
  const filteredNeighborhoods = useMemo(() => {
    if (!selectedCityData) return [];
    
    return selectedCityData.neighborhoods
      .filter(neighborhood => 
        neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [selectedCityData, searchTerm]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedNeighborhood('');
    setSearchTerm('');
    setCustomerInfo(prev => ({ ...prev, city: cityName, neighborhood: '' }));
  };

  const handleNeighborhoodSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    setCustomerInfo(prev => ({ ...prev, neighborhood }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: // Delivery type
        return true;
      case 2: // Personal info
        return customerInfo.name && customerInfo.phone;
      case 3: // Address (only for delivery)
        if (customerInfo.deliveryType === 'pickup') return true;
        return customerInfo.address && selectedCity && selectedNeighborhood;
      case 4: // Payment method
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNext()) {
      if (currentStep === 2 && customerInfo.deliveryType === 'pickup') {
        setCurrentStep(4); // Skip address step for pickup
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && customerInfo.deliveryType === 'pickup') {
      setCurrentStep(2); // Skip address step for pickup
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const isFormValid = () => {
    if (customerInfo.deliveryType === 'delivery') {
      return customerInfo.name && 
             customerInfo.phone && 
             customerInfo.address && 
             selectedCity &&
             selectedNeighborhood;
    }
    return customerInfo.name && customerInfo.phone;
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Truck size={20} />;
      case 2: return <User size={20} />;
      case 3: return <MapPin size={20} />;
      case 4: return <CreditCard size={20} />;
      default: return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Tipo de entrega';
      case 2: return 'Datos personales';
      case 3: return 'Dirección';
      case 4: return 'Método de pago';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-cream to-cream-light">
      {/* Progress bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b-2 border-gold/20 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-wood-dark font-title">Finalizar Pedido</h2>
          <span className="text-wood-medium font-medium">
            Paso {currentStep} de {totalSteps}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const shouldShow = customerInfo.deliveryType === 'pickup' ? stepNumber !== 3 : true;
            
            if (!shouldShow) return null;
            
            return (
              <React.Fragment key={stepNumber}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                        ? 'bg-gold border-gold text-white shadow-glow'
                        : 'bg-white border-wood-light/30 text-wood-medium'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} />
                  ) : (
                    getStepIcon(stepNumber)
                  )}
                </motion.div>
                
                {stepNumber < totalSteps && (
                  <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    stepNumber < currentStep ? 'bg-green-500' : 'bg-wood-light/20'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        <p className="text-wood-medium text-sm mt-3">
          {getStepTitle(currentStep)}
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Delivery Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-wood-dark mb-4 font-title">¿Cómo prefieres recibir tu pedido?</h3>
                <p className="text-wood-medium text-lg">Selecciona la opción que más te convenga</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCustomerInfo(prev => ({ ...prev, deliveryType: 'delivery' }));
                    setTimeout(nextStep, 300);
                  }}
                  className={`p-8 rounded-3xl flex flex-col items-center gap-4 transition-all duration-300 border-2 ${
                    customerInfo.deliveryType === 'delivery'
                      ? 'bg-gradient-to-br from-gold to-gold/90 text-white shadow-glow-strong border-gold transform scale-105'
                      : 'bg-white border-gold/30 text-wood-dark hover:border-gold/50 hover:shadow-lg'
                  }`}
                >
                  <Truck size={48} />
                  <div className="text-center">
                    <span className="font-bold text-2xl block">Domicilio</span>
                    <span className="text-lg opacity-90 mt-2 block">Entrega a tu dirección</span>
                    <span className="text-sm opacity-80 mt-1 block">Tiempo estimado: 30-45 min</span>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCustomerInfo(prev => ({ ...prev, deliveryType: 'pickup' }));
                    setTimeout(nextStep, 300);
                  }}
                  className={`p-8 rounded-3xl flex flex-col items-center gap-4 transition-all duration-300 border-2 ${
                    customerInfo.deliveryType === 'pickup'
                      ? 'bg-gradient-to-br from-gold to-gold/90 text-white shadow-glow-strong border-gold transform scale-105'
                      : 'bg-white border-gold/30 text-wood-dark hover:border-gold/50 hover:shadow-lg'
                  }`}
                >
                  <Store size={48} />
                  <div className="text-center">
                    <span className="font-bold text-2xl block">Recoger</span>
                    <span className="text-lg opacity-90 mt-2 block">Recoger en el local</span>
                    <span className="text-sm opacity-80 mt-1 block">Tiempo estimado: 15-20 min</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-wood-dark mb-4 font-title">Cuéntanos sobre ti</h3>
                <p className="text-wood-medium text-lg">Necesitamos estos datos para contactarte</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xl font-bold text-wood-dark mb-4">¿Cuál es tu nombre?</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-6 border-2 border-wood-light/30 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all text-xl shadow-inner"
                    placeholder="Tu nombre completo"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xl font-bold text-wood-dark mb-4">¿Cuál es tu número de teléfono?</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-6 border-2 border-wood-light/30 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all text-xl shadow-inner"
                    placeholder="Ej: 300 123 4567"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Address (only for delivery) */}
          {currentStep === 3 && customerInfo.deliveryType === 'delivery' && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-wood-dark mb-4 font-title">¿A dónde llevamos tu pedido?</h3>
                <p className="text-wood-medium text-lg">Selecciona tu ubicación para calcular el costo de envío</p>
              </div>
              
              {/* City Selection */}
              <div>
                <label className="block text-xl font-bold text-wood-dark mb-6">Primero, selecciona tu ciudad</label>
                <div className="grid grid-cols-2 gap-4">
                  {cities.map(city => (
                    <motion.button
                      key={city.name}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleCitySelect(city.name);
                        setTimeout(() => {
                          const element = document.getElementById('neighborhood-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className={`p-6 rounded-2xl text-center transition-all duration-300 border-2 ${
                        selectedCity === city.name
                          ? 'bg-gradient-to-br from-gold to-gold/90 text-white shadow-glow border-gold transform scale-105'
                          : 'bg-white border-gold/30 text-wood-dark hover:border-gold/50 hover:shadow-lg'
                      }`}
                    >
                      <span className="font-bold text-xl block">{city.name}</span>
                      <div className="text-sm opacity-80 mt-2">
                        {city.neighborhoods.length} barrios disponibles
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Neighborhood Selection */}
              {selectedCity && (
                <motion.div
                  id="neighborhood-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <label className="block text-xl font-bold text-wood-dark">
                    Ahora selecciona tu barrio en {selectedCity}
                  </label>
                  
                  {/* Search bar */}
                  <div className="relative">
                    <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wood-medium" />
                    <input
                      type="text"
                      placeholder="Buscar barrio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-4 py-4 border-2 border-wood-light/30 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all text-lg shadow-inner"
                    />
                  </div>

                  {/* Neighborhoods grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {filteredNeighborhoods.length > 0 ? (
                      filteredNeighborhoods.map(neighborhood => (
                        <motion.button
                          key={neighborhood.name}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleNeighborhoodSelect(neighborhood.name);
                            setTimeout(() => {
                              const element = document.getElementById('address-section');
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
                          className={`p-4 rounded-2xl text-left transition-all duration-200 border-2 ${
                            selectedNeighborhood === neighborhood.name
                              ? 'bg-gradient-to-r from-gold to-gold/90 text-white shadow-glow border-gold'
                              : 'bg-white hover:bg-gold/10 text-wood-dark border-transparent hover:border-gold/30'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">{neighborhood.name}</span>
                            <span className={`text-lg font-bold ${
                              selectedNeighborhood === neighborhood.name ? 'text-white' : 'text-gold'
                            }`}>
                              {formatPrice(neighborhood.price)}
                            </span>
                          </div>
                        </motion.button>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-wood-medium">
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No se encontraron barrios con "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Address Input */}
              {selectedNeighborhood && (
                <motion.div
                  id="address-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <label className="block text-xl font-bold text-wood-dark">
                    Finalmente, tu dirección completa
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-6 border-2 border-wood-light/30 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all text-xl shadow-inner"
                    placeholder="Ej: Calle 123 #45-67, Apto 101"
                    autoFocus
                  />
                  <p className="text-wood-medium text-sm">
                    Incluye detalles como número de apartamento, referencias, etc.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Payment Method */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-wood-dark mb-4 font-title">¿Cómo vas a pagar?</h3>
                <p className="text-wood-medium text-lg">Elige tu método de pago preferido</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCustomerInfo(prev => ({ ...prev, paymentMethod: 'efectivo' }))}
                  className={`p-8 rounded-3xl text-center transition-all duration-300 border-2 ${
                    customerInfo.paymentMethod === 'efectivo'
                      ? 'bg-gradient-to-br from-gold to-gold/90 text-white shadow-glow-strong border-gold transform scale-105'
                      : 'bg-white border-gold/30 text-wood-dark hover:border-gold/50 hover:shadow-lg'
                  }`}
                >
                  <DollarSign size={48} className="mx-auto mb-4" />
                  <div className="font-bold text-2xl mb-2">Efectivo</div>
                  <div className="text-lg opacity-90 mb-2">Pago al recibir</div>
                  <div className="text-sm opacity-80">Paga cuando llegue tu pedido</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCustomerInfo(prev => ({ ...prev, paymentMethod: 'transferencia' }))}
                  className={`p-8 rounded-3xl text-center transition-all duration-300 border-2 ${
                    customerInfo.paymentMethod === 'transferencia'
                      ? 'bg-gradient-to-br from-gold to-gold/90 text-white shadow-glow-strong border-gold transform scale-105'
                      : 'bg-white border-gold/30 text-wood-dark hover:border-gold/50 hover:shadow-lg'
                  }`}
                >
                  <CreditCard size={48} className="mx-auto mb-4" />
                  <div className="font-bold text-2xl mb-2">Transferencia</div>
                  <div className="text-lg opacity-90 mb-2">Pago anticipado</div>
                  <div className="text-sm opacity-80">Transfiere antes de preparar</div>
                </motion.button>
              </div>

              {/* Transfer instructions */}
              {customerInfo.paymentMethod === 'transferencia' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-6"
                >
                  <div className="text-center mb-4">
                    <CreditCard size={32} className="text-blue-600 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-blue-800 mb-2">Instrucciones para transferencia</h4>
                  </div>
                  
                  <div className="space-y-3 text-blue-700">
                    <p className="font-semibold">📱 Número para consignar:</p>
                    <p className="text-2xl font-bold text-center bg-white/70 py-3 rounded-xl border border-blue-300">
                      {restaurantConfig.bankAccount || '300 123 4567'}
                    </p>
                    
                    <div className="bg-white/50 rounded-xl p-4 border border-blue-200">
                      <p className="font-semibold mb-2">📋 Pasos a seguir:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Confirma tu pedido en esta página</li>
                        <li>Realiza la transferencia al número mostrado</li>
                        <li>Envía el comprobante por WhatsApp</li>
                        <li>¡Listo! Prepararemos tu pedido</li>
                      </ol>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation and summary */}
      <div className="border-t-2 border-gold/30 bg-white/90 backdrop-blur-sm p-6 space-y-6 shadow-luxury flex-shrink-0">
        {/* Order Summary */}
        <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-3xl p-6 border-2 border-gold/30 shadow-inner">
          <div className="space-y-3">
            <div className="flex justify-between text-wood-dark text-lg">
              <span className="font-bold">Subtotal:</span>
              <span className="font-bold">{formatPrice(cartTotal)}</span>
            </div>
            {customerInfo.deliveryType === 'delivery' && deliveryPrice > 0 && (
              <div className="flex justify-between text-wood-dark text-lg">
                <span className="font-bold">Domicilio a {selectedNeighborhood}:</span>
                <span className="font-bold text-gold">{formatPrice(deliveryPrice)}</span>
              </div>
            )}
            <div className="border-t-2 border-gold/30 pt-3">
              <div className="flex justify-between text-2xl font-bold text-wood-dark">
                <span>Total:</span>
                <span className="text-gold">
                  {formatPrice(cartTotal + (customerInfo.deliveryType === 'delivery' ? deliveryPrice : 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {currentStep > 1 && (
            <motion.button
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              className="flex items-center gap-3 px-6 py-4 bg-wood-light/20 hover:bg-wood-light/30 text-wood-dark rounded-2xl font-bold transition-all border-2 border-wood-light/30"
            >
              <ArrowLeft size={20} />
              Anterior
            </motion.button>
          )}
          
          {currentStep === 1 && (
            <motion.button
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex items-center gap-3 px-6 py-4 bg-wood-light/20 hover:bg-wood-light/30 text-wood-dark rounded-2xl font-bold transition-all border-2 border-wood-light/30"
            >
              <ArrowLeft size={20} />
              Volver al carrito
            </motion.button>
          )}

          {currentStep < totalSteps ? (
            <motion.button
              whileHover={canProceedToNext() ? { scale: 1.02, x: 2 } : {}}
              whileTap={canProceedToNext() ? { scale: 0.98 } : {}}
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-300 border-2 ${
                canProceedToNext()
                  ? 'bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white shadow-luxury hover:shadow-glow-strong border-gold/30'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-200'
              }`}
            >
              Continuar
              <ArrowRight size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={isFormValid() ? { scale: 1.02, y: -2 } : {}}
              whileTap={isFormValid() ? { scale: 0.98 } : {}}
              onClick={onSubmit}
              disabled={!isFormValid()}
              className={`flex-1 flex items-center justify-center gap-4 py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 border-2 ${
                isFormValid()
                  ? 'bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-white shadow-luxury hover:shadow-glow-strong border-gold/30'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-200'
              }`}
            >
              <Send size={24} />
              <span>Confirmar Pedido</span>
              {isFormValid() && (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutWizard;