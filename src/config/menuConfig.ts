// Configuración del menú del restaurante
export interface MenuConfig {
  sopaDia: string;
  ensaladaDia: string;
  principioDia: string;
  horaAlmuerzoInicio: string;
  horaAlmuerzoFinalEntresemana: string;
  horaAlmuerzoFinalFds: string;
  horaComidaInicio: string;
  horaComidaFinal: string;
  cerradoInusual: boolean;
  abiertoInusual: boolean;
  nombre: string;
  direccion: string;
  nequi: string;
  celular: string;
  telefono: string;
  frase: string;
  almuerzo: string;
  comida: string;
  almuerzoSabado: string;
  almuerzoDomingo: string;
}

// URLs de las imágenes del menú
export const MENU_IMAGES = {
  ALMUERZO_SEMANA: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+ALMUERZO.png",
  ALMUERZO_SABADO_FESTIVO: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+ALMUERZO+SABADO.png",
  ALMUERZO_DOMINGO: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+ALMUERZO+DOMINGO.png",
  COMIDA: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+COMIDA.png"
};

// Configuración por defecto del restaurante
export const menuConfig: MenuConfig = {
  sopaDia: "arroz",
  ensaladaDia: "cebolla y tomate",
  principioDia: "lentejas",
  horaAlmuerzoInicio: "11:00",
  horaAlmuerzoFinalEntresemana: "14:00",
  horaAlmuerzoFinalFds: "15:00",
  horaComidaInicio: "18:00",
  horaComidaFinal: "21:30",
  cerradoInusual: false,
  abiertoInusual: false,
  nombre: "Luis Res",
  direccion: "Cra 37 #109-24, Floridablanca - Barrio Caldas",
  nequi: "3175816061",
  celular: "573166193963",
  telefono: "573166193963",
  frase: "Más de una década sirviendo los sabores auténticos de Santander con ingredientes frescos y recetas tradicionales que pasan de generación en generación.",
  almuerzo: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+ALMUERZO.jpg",
  comida: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+COMIDA.jpg",
  almuerzoSabado: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+ALMUERZO+SABADO.jpg",
  almuerzoDomingo: "https://alliasoft.s3.us-east-2.amazonaws.com/restaurante-luisres/MENU+ALMUERZO+DOMINGO.jpg"
};

// Función para determinar qué imagen mostrar según la hora y día
export const getCurrentMenuImage = (): string => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;
  const dayOfWeek = now.getDay(); // 0 = Domingo, 6 = Sábado

  // Convertir horas a minutos para comparación
  const [almuerzoInicioHour, almuerzoInicioMin] = menuConfig.horaAlmuerzoInicio.split(':').map(Number);
  const almuerzoInicio = almuerzoInicioHour * 60 + almuerzoInicioMin;

  const [comidaInicioHour, comidaInicioMin] = menuConfig.horaComidaInicio.split(':').map(Number);
  const comidaInicio = comidaInicioHour * 60 + comidaInicioMin;

  // Determinar horario de fin de almuerzo según el día
  let almuerzoFin: number;
  if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingo o Sábado
    const [finFdsHour, finFdsMin] = menuConfig.horaAlmuerzoFinalFds.split(':').map(Number);
    almuerzoFin = finFdsHour * 60 + finFdsMin;
  } else {
    const [finSemanaHour, finSemanaMin] = menuConfig.horaAlmuerzoFinalEntresemana.split(':').map(Number);
    almuerzoFin = finSemanaHour * 60 + finSemanaMin;
  }

  // Si es hora de comida
  if (currentTime >= comidaInicio) {
    return MENU_IMAGES.COMIDA;
  }

  // Si es hora de almuerzo
  if (currentTime >= almuerzoInicio && currentTime < almuerzoFin) {
    if (dayOfWeek === 0) { // Domingo
      return MENU_IMAGES.ALMUERZO_DOMINGO;
    } else if (dayOfWeek === 6) { // Sábado
      return MENU_IMAGES.ALMUERZO_SABADO_FESTIVO;
    } else { // Lunes a Viernes
      return MENU_IMAGES.ALMUERZO_SEMANA;
    }
  }

  // Por defecto, mostrar menú de almuerzo de semana
  return MENU_IMAGES.ALMUERZO_SEMANA;
};

// Función para obtener el tipo de servicio actual
export const getCurrentServiceType = (): 'almuerzo' | 'comida' => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;

  const [comidaInicioHour, comidaInicioMin] = menuConfig.horaComidaInicio.split(':').map(Number);
  const comidaInicio = comidaInicioHour * 60 + comidaInicioMin;

  return currentTime >= comidaInicio ? 'comida' : 'almuerzo';
};