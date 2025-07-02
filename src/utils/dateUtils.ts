import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CartItem, CustomerInfo } from '../types';
import { getDaySchedule, getRestaurantStatus, restaurantConfig } from '../config/restaurant';

export const cities = [
  {
    name: 'Floridablanca',
    neighborhoods: [
      { name: 'Caldas', price: 4000 },
      { name: 'Cañaveral', price: 4000 },
      { name: 'Lagos', price: 4000 },
      { name: 'Valencia', price: 5000 },
      { name: 'Bucarica', price: 4500 },
      { name: 'Ciudad Valencia', price: 5000 },
      { name: 'El Bosque', price: 4500 }
    ]
  },
  {
    name: 'Bucaramanga',
    neighborhoods: [
      { name: 'Cabecera', price: 5000 },
      { name: 'Sotomayor', price: 5000 },
      { name: 'Real de Minas', price: 6000 },
      { name: 'García Rovira', price: 5500 },
      { name: 'Centro', price: 6000 },
      { name: 'San Francisco', price: 5500 },
      { name: 'La Aurora', price: 6000 }
    ]
  },
  {
    name: 'Piedecuesta',
    neighborhoods: [
      { name: 'Centro', price: 7000 },
      { name: 'Refugio', price: 7000 },
      { name: 'Guatiguará', price: 8000 }
    ]
  },
  {
    name: 'Girón',
    neighborhoods: [
      { name: 'Carrizal', price: 6000 },
      { name: 'Poblado', price: 6000 },
      { name: 'El Jardín', price: 6500 }
    ]
  }
];

// Verificar si el servicio está disponible en el horario actual
export const isServiceAvailable = (serviceType: 'lunch' | 'dinner', date: Date = new Date()): boolean => {
  const schedule = getDaySchedule(date);
  
  if (schedule.isClosed) return false;
  
  const service = serviceType === 'lunch' ? schedule.lunch : schedule.dinner;
  if (!service.enabled) return false;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;
  
  const [startHour, startMinute] = service.start.split(':').map(Number);
  const [endHour, endMinute] = service.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return currentTime >= startTime && currentTime <= endTime;
};

export const isDinnerAvailable = (date: Date = new Date()): boolean => {
  return isServiceAvailable('dinner', date);
};

export const isLunchAvailable = (date: Date = new Date()): boolean => {
  return isServiceAvailable('lunch', date);
};

export const formatCurrentDate = (): string => {
  return format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateItemPrice = (item: CartItem): number => {
  let price = item.valor;
  if (item.isForTakeaway && item.precio_adicional_llevar) {
    price += item.precio_adicional_llevar;
  }
  return price * item.quantity;
};

export const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
};

// Obtener próximo horario disponible
export const getNextAvailableService = (date: Date = new Date()): {
  service: 'lunch' | 'dinner';
  schedule: { start: string; end: string };
  day: string;
} | null => {
  const schedule = getDaySchedule(date);
  
  if (schedule.isClosed) {
    // Buscar el próximo día abierto
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getNextAvailableService(tomorrow);
  }
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Verificar almuerzo
  if (schedule.lunch.enabled) {
    const [lunchStartHour, lunchStartMinute] = schedule.lunch.start.split(':').map(Number);
    const lunchStartTime = lunchStartHour * 60 + lunchStartMinute;
    
    if (currentTime < lunchStartTime) {
      return {
        service: 'lunch',
        schedule: schedule.lunch,
        day: format(date, 'EEEE', { locale: es })
      };
    }
  }
  
  // Verificar cena
  if (schedule.dinner.enabled) {
    const [dinnerStartHour, dinnerStartMinute] = schedule.dinner.start.split(':').map(Number);
    const dinnerStartTime = dinnerStartHour * 60 + dinnerStartMinute;
    
    if (currentTime < dinnerStartTime) {
      return {
        service: 'dinner',
        schedule: schedule.dinner,
        day: format(date, 'EEEE', { locale: es })
      };
    }
  }
  
  // Si no hay más servicios hoy, buscar mañana
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getNextAvailableService(tomorrow);
};

export const formatWhatsAppMessage = (
  items: CartItem[], 
  customerInfo: CustomerInfo, 
  deliveryPrice: number
): string => {
  const itemsList = items.map(item => {
    const price = calculateItemPrice(item);
    const notes = item.notes ? `\n   Notas: ${item.notes}` : '';
    return `• ${item.quantity}x ${item.nombre} - ${formatPrice(price)}${notes}`;
  }).join('\n\n');

  const subtotal = calculateTotalPrice(items);
  const total = subtotal + (customerInfo.deliveryType === 'delivery' ? deliveryPrice : 0);

  const restaurantStatus = getRestaurantStatus();
  const statusInfo = restaurantStatus.isSpecialDay ? 
    `\n🎉 ${restaurantStatus.reason}\n` : '';

  let paymentInstructions = '';
  if (customerInfo.paymentMethod === 'transferencia') {
    paymentInstructions = `\n💳 *INSTRUCCIONES DE PAGO:*
1. Realiza la transferencia a: ${restaurantConfig.bankAccount || '300 123 4567'}
2. Envía el comprobante por este WhatsApp
3. Una vez confirmado el pago, prepararemos tu pedido\n`;
  }

  const message = `
🍽️ *PEDIDO LUIS RES* 🍽️
${statusInfo}
👤 *DATOS DEL CLIENTE:*
Nombre: ${customerInfo.name}
Teléfono: ${customerInfo.phone}
${customerInfo.deliveryType === 'delivery' ? 
  `🏠 Dirección: ${customerInfo.address}\n📍 Ciudad: ${customerInfo.city}${customerInfo.neighborhood ? ` - ${customerInfo.neighborhood}` : ''}` : 
  '🏪 Para recoger en el local'
}
💳 Método de pago: ${customerInfo.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}
${paymentInstructions}
🍽️ *PEDIDO:*
${itemsList}

💰 *RESUMEN:*
Subtotal: ${formatPrice(subtotal)}
${customerInfo.deliveryType === 'delivery' ? `🚚 Domicilio: ${formatPrice(deliveryPrice)}\n` : ''}*Total: ${formatPrice(total)}*

📅 Fecha: ${formatCurrentDate()}

¡Gracias por elegir Luis Res! 🙏
`.trim();

  return encodeURIComponent(message);
};

// Exportar la configuración del restaurante para compatibilidad
export { restaurantConfig, getDaySchedule, getRestaurantStatus, isRestaurantClosed };