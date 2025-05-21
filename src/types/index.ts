export interface MenuItem {
  id: string;
  nombre: string;
  descripcion: string | null;
  servicios: string[];
  categorias: string[];
  disponible: boolean;
  para_llevar: boolean;
  url_imagen: string | null;
  precio_adicional_llevar: number | null;
  dias: number[];
  valor: number;
}

export type ServiceType = 'almuerzo' | 'cena';

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
  isForTakeaway?: boolean;
}

export interface DeliveryZone {
  name: string;
  price: number;
  cities: string[];
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'efectivo' | 'transferencia';
  deliveryType: 'delivery' | 'pickup';
  addressConfirmed?: boolean;
}

export interface RestaurantInfo {
  address: string;
  phone: string;
  whatsapp: string;
  schedule: {
    lunch: {
      start: string;
      end: string;
    };
    dinner: {
      start: string;
      end: string;
    };
  };
}