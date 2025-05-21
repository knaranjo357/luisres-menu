import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CartItem, CustomerInfo } from '../types';

export const cities = [
  {
    name: 'Floridablanca',
    neighborhoods: [
      { name: 'Caldas', price: 4000 },
      { name: 'Cañaveral', price: 4000 },
      { name: 'Lagos', price: 4000 },
      { name: 'Valencia', price: 5000 }
    ]
  },
  {
    name: 'Bucaramanga',
    neighborhoods: [
      { name: 'Cabecera', price: 5000 },
      { name: 'Sotomayor', price: 5000 },
      { name: 'Real de Minas', price: 6000 }
    ]
  },
  {
    name: 'Piedecuesta',
    neighborhoods: [
      { name: 'Centro', price: 7000 },
      { name: 'Refugio', price: 7000 }
    ]
  },
  {
    name: 'Girón',
    neighborhoods: [
      { name: 'Carrizal', price: 6000 },
      { name: 'Poblado', price: 6000 }
    ]
  }
];

export const restaurantConfig = {
  mondayClosed: true,
  info: {
    whatsapp: '573166193963',
    phone: '6363610',
    address: 'Cra 37 #109-24, Floridablanca - Barrio Caldas'
  },
  schedule: {
    lunch: {
      start: '11:00',
      end: '14:00'
    },
    dinner: {
      start: '18:00',
      end: '21:00'
    }
  }
};

export const isTodayMonday = (): boolean => {
  return new Date().getDay() === 1;
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

export const formatWhatsAppMessage = (
  items: CartItem[], 
  customerInfo: CustomerInfo, 
  deliveryPrice: number
): string => {
  const itemsList = items.map(item => {
    const price = calculateItemPrice(item);
    const notes = item.notes ? `\nNotas: ${item.notes}` : '';
    return `• ${item.quantity}x ${item.nombre} - ${formatPrice(price)}${notes}`;
  }).join('\n\n');

  const subtotal = calculateTotalPrice(items);
  const total = subtotal + (customerInfo.deliveryType === 'delivery' ? deliveryPrice : 0);

  const message = `
¡Hola! Me gustaría hacer un pedido:

DATOS DEL CLIENTE:
Nombre: ${customerInfo.name}
Teléfono: ${customerInfo.phone}
${customerInfo.deliveryType === 'delivery' ? `Dirección: ${customerInfo.address}\nCiudad: ${customerInfo.city}` : 'Para recoger en el local'}
Método de pago: ${customerInfo.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}

PEDIDO:
${itemsList}

RESUMEN:
Subtotal: ${formatPrice(subtotal)}
${customerInfo.deliveryType === 'delivery' ? `Domicilio: ${formatPrice(deliveryPrice)}\n` : ''}Total: ${formatPrice(total)}
`.trim();

  return encodeURIComponent(message);
};