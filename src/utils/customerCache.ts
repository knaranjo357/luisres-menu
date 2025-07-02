// Utilidad para manejar el caché de datos del cliente
interface CachedCustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  neighborhood: string;
  paymentMethod: 'efectivo' | 'transferencia';
  deliveryType: 'delivery' | 'pickup';
  lastUsed: number;
}

const CACHE_KEY = 'luis_res_customer_info';
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 días

export const saveCustomerInfo = (customerInfo: Partial<CachedCustomerInfo>) => {
  try {
    const dataToSave: CachedCustomerInfo = {
      name: customerInfo.name || '',
      phone: customerInfo.phone || '',
      address: customerInfo.address || '',
      city: customerInfo.city || '',
      neighborhood: customerInfo.neighborhood || '',
      paymentMethod: customerInfo.paymentMethod || 'efectivo',
      deliveryType: customerInfo.deliveryType || 'delivery',
      lastUsed: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn('No se pudo guardar la información del cliente:', error);
  }
};

export const loadCustomerInfo = (): Partial<CachedCustomerInfo> | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CachedCustomerInfo = JSON.parse(cached);
    
    // Verificar si el caché ha expirado
    if (Date.now() - data.lastUsed > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('No se pudo cargar la información del cliente:', error);
    return null;
  }
};

export const clearCustomerInfo = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('No se pudo limpiar la información del cliente:', error);
  }
};

export const hasCustomerInfo = (): boolean => {
  const cached = loadCustomerInfo();
  return cached !== null && (cached.name || cached.phone) ? true : false;
};