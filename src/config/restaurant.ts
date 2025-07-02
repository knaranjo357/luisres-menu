// Restaurant Configuration - Centraliza toda la configuración del restaurante
export interface RestaurantSchedule {
  start: string;
  end: string;
  enabled: boolean;
}

export interface DaySchedule {
  lunch: RestaurantSchedule;
  dinner: RestaurantSchedule;
  isClosed: boolean;
  isSpecialDay?: boolean;
  reason?: string; // Motivo del cierre o apertura especial
}

export interface WeekSchedule {
  [key: number]: DaySchedule; // 0 = Domingo, 1 = Lunes, etc.
}

export interface SpecialDate {
  date: string; // YYYY-MM-DD
  schedule: DaySchedule;
  reason: string;
}

export interface RestaurantConfig {
  info: {
    name: string;
    whatsapp: string;
    phone: string;
    address: string;
    email?: string;
  };
  defaultSchedule: WeekSchedule;
  specialDates: SpecialDate[];
  autoSwitch: {
    toLunch: boolean; // Auto cambiar a almuerzo si la cena no está disponible
    toDinner: boolean; // Auto cambiar a cena cuando esté disponible
  };
  delivery: {
    enabled: boolean;
    minimumOrder: number;
  };
  bankAccount?: string; // Para transferencias
}

// Configuración por defecto del restaurante
export const restaurantConfig: RestaurantConfig = {
  info: {
    name: 'Luis Res',
    whatsapp: '573166193963',
    phone: '6363610',
    address: 'Cra 37 #109-24, Floridablanca - Barrio Caldas',
    email: 'info@luisres.com'
  },
  defaultSchedule: {
    0: { // Domingo
      lunch: { start: '11:00', end: '15:00', enabled: true },
      dinner: { start: '18:00', end: '21:00', enabled: false }, // No cena los domingos
      isClosed: false
    },
    1: { // Lunes
      lunch: { start: '11:00', end: '15:00', enabled: false },
      dinner: { start: '18:00', end: '21:00', enabled: false },
      isClosed: true, // Cerrado los lunes por defecto
      reason: 'Día de descanso del personal'
    },
    2: { // Martes
      lunch: { start: '11:00', end: '15:00', enabled: true },
      dinner: { start: '18:00', end: '21:00', enabled: true },
      isClosed: false
    },
    3: { // Miércoles
      lunch: { start: '11:00', end: '15:00', enabled: true },
      dinner: { start: '18:00', end: '21:00', enabled: true },
      isClosed: false
    },
    4: { // Jueves
      lunch: { start: '11:00', end: '15:00', enabled: true },
      dinner: { start: '18:00', end: '21:00', enabled: true },
      isClosed: false
    },
    5: { // Viernes
      lunch: { start: '11:00', end: '15:00', enabled: true },
      dinner: { start: '18:00', end: '22:00', enabled: true }, // Viernes hasta más tarde
      isClosed: false
    },
    6: { // Sábado
      lunch: { start: '11:00', end: '15:00', enabled: true },
      dinner: { start: '18:00', end: '22:00', enabled: true },
      isClosed: false
    }
  },
  specialDates: [
    // Ejemplo: Apertura especial en lunes festivo
    {
      date: '2024-12-23', // Lunes 23 de diciembre
      schedule: {
        lunch: { start: '12:00', end: '16:00', enabled: true },
        dinner: { start: '19:00', end: '22:00', enabled: true },
        isClosed: false,
        isSpecialDay: true,
        reason: 'Apertura especial por festividad'
      },
      reason: 'Apertura especial - Víspera de Navidad'
    },
    // Ejemplo: Cierre especial
    {
      date: '2024-12-25', // Navidad
      schedule: {
        lunch: { start: '11:00', end: '15:00', enabled: false },
        dinner: { start: '18:00', end: '21:00', enabled: false },
        isClosed: true,
        isSpecialDay: true,
        reason: 'Celebración navideña'
      },
      reason: 'Cerrado por Navidad'
    }
  ],
  autoSwitch: {
    toLunch: true,
    toDinner: true
  },
  delivery: {
    enabled: true,
    minimumOrder: 15000
  },
  bankAccount: '300 123 4567' // Número para transferencias
};

// Función para obtener el horario de un día específico
export const getDaySchedule = (date: Date): DaySchedule => {
  const dateString = date.toISOString().split('T')[0];
  const dayOfWeek = date.getDay();
  
  // Buscar primero en fechas especiales
  const specialDate = restaurantConfig.specialDates.find(special => 
    special.date === dateString
  );
  
  if (specialDate) {
    return specialDate.schedule;
  }
  
  // Si no hay fecha especial, usar horario por defecto
  return restaurantConfig.defaultSchedule[dayOfWeek];
};

// Función para verificar si el restaurante está cerrado hoy
export const isRestaurantClosed = (date: Date = new Date()): boolean => {
  const schedule = getDaySchedule(date);
  return schedule.isClosed;
};

// Función para obtener el motivo del cierre o estado especial
export const getRestaurantStatus = (date: Date = new Date()): {
  isClosed: boolean;
  reason?: string;
  isSpecialDay?: boolean;
} => {
  const schedule = getDaySchedule(date);
  return {
    isClosed: schedule.isClosed,
    reason: schedule.reason,
    isSpecialDay: schedule.isSpecialDay
  };
};