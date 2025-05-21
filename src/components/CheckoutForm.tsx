import React, { useState } from 'react';
import { Send, Truck, Store } from 'lucide-react';
import { CustomerInfo } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateTotalPrice, cities } from '../utils/dateUtils';

interface CheckoutFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customerInfo,
  setCustomerInfo,
  onBack,
  onSubmit
}) => {
  const { items } = useCart();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  
  const cartTotal = calculateTotalPrice(items);
  const selectedCityData = cities.find(city => city.name === selectedCity);
  const deliveryPrice = selectedNeighborhood ? 
    selectedCityData?.neighborhoods.find(n => n.name === selectedNeighborhood)?.price || 0 : 0;

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedNeighborhood('');
    setCustomerInfo(prev => ({ ...prev, city: cityName }));
  };

  const handleNeighborhoodSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    setCustomerInfo(prev => ({ ...prev, neighborhood }));
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-wood-dark mb-2">Tipo de entrega</label>
          <div className="flex gap-2">
            <button
              onClick={() => setCustomerInfo(prev => ({ ...prev, deliveryType: 'delivery' }))}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
                customerInfo.deliveryType === 'delivery'
                  ? 'bg-wood-dark text-cream'
                  : 'bg-wood-light/10 text-wood-dark hover:bg-wood-light/20'
              }`}
            >
              <Truck size={20} />
              <span>Domicilio</span>
            </button>
            <button
              onClick={() => setCustomerInfo(prev => ({ ...prev, deliveryType: 'pickup' }))}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
                customerInfo.deliveryType === 'pickup'
                  ? 'bg-wood-dark text-cream'
                  : 'bg-wood-light/10 text-wood-dark hover:bg-wood-light/20'
              }`}
            >
              <Store size={20} />
              <span>Recoger</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-wood-dark mb-2">Nombre</label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-light focus:border-wood-light"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-wood-dark mb-2">Teléfono</label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-light focus:border-wood-light"
            placeholder="Tu número de teléfono"
          />
        </div>

        {customerInfo.deliveryType === 'delivery' && (
          <>
            <div>
              <label className="block text-sm font-medium text-wood-dark mb-2">Ciudad</label>
              <div className="grid grid-cols-2 gap-2">
                {cities.map(city => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className={`p-3 rounded-lg text-center ${
                      selectedCity === city.name
                        ? 'bg-wood-dark text-cream'
                        : 'bg-wood-light/10 text-wood-dark hover:bg-wood-light/20'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedCity && (
              <div>
                <label className="block text-sm font-medium text-wood-dark mb-2">Barrio</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCityData?.neighborhoods.map(neighborhood => (
                    <button
                      key={neighborhood.name}
                      onClick={() => handleNeighborhoodSelect(neighborhood.name)}
                      className={`p-3 rounded-lg text-center ${
                        selectedNeighborhood === neighborhood.name
                          ? 'bg-wood-dark text-cream'
                          : 'bg-wood-light/10 text-wood-dark hover:bg-wood-light/20'
                      }`}
                    >
                      <span className="block">{neighborhood.name}</span>
                      <span className="block text-sm text-wood-medium mt-1">
                        {formatPrice(neighborhood.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-wood-dark mb-2">Dirección</label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-wood-light focus:border-wood-light"
                placeholder="Dirección de entrega"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-wood-dark mb-2">Método de pago</label>
          <div className="flex gap-2">
            <button
              onClick={() => setCustomerInfo(prev => ({ ...prev, paymentMethod: 'efectivo' }))}
              className={`flex-1 p-3 rounded-lg ${
                customerInfo.paymentMethod === 'efectivo'
                  ? 'bg-wood-dark text-cream'
                  : 'bg-wood-light/10 text-wood-dark hover:bg-wood-light/20'
              }`}
            >
              Efectivo
            </button>
            <button
              onClick={() => setCustomerInfo(prev => ({ ...prev, paymentMethod: 'transferencia' }))}
              className={`flex-1 p-3 rounded-lg ${
                customerInfo.paymentMethod === 'transferencia'
                  ? 'bg-wood-dark text-cream'
                  : 'bg-wood-light/10 text-wood-dark hover:bg-wood-light/20'
              }`}
            >
              Transferencia
            </button>
          </div>
        </div>
      </div>

      <div className="border-t bg-cream p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-wood-dark">
            <span>Subtotal:</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          {customerInfo.deliveryType === 'delivery' && deliveryPrice > 0 && (
            <div className="flex justify-between text-wood-dark">
              <span>Domicilio:</span>
              <span>{formatPrice(deliveryPrice)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-wood-dark">
            <span>Total:</span>
            <span>{formatPrice(cartTotal + (customerInfo.deliveryType === 'delivery' ? deliveryPrice : 0))}</span>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={!isFormValid()}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            isFormValid()
              ? 'bg-wood-dark text-cream hover:bg-wood-medium'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
          Hacer Pedido
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;