import axios from 'axios';
import { MenuItem } from '../types';

const API_URL = 'https://n8n.alliasoft.com/webhook/luis-res/menu';

// Mock data to use while API is unavailable
const mockMenuItems: MenuItem[] = [
  {
    id: "a4d1a8ea-e0ae-4491-8c1f-3461bf56c726",
    nombre: "Carne fresca",
    descripcion: "Carne de res a la plancha",
    precio: 13000,
    precio_domingo: 14000,
    servicios: ["almuerzo"],
    categorias: ["almuerzo"],
    disponible: true,
    para_llevar: true,
    url_imagen: null
  },
  {
    id: "c3bd7189-b3b7-4262-ad09-70ebb5759d48",
    nombre: "Semioreada",
    descripcion: "Carne semisecada estilo de la casa",
    precio: 13000,
    precio_domingo: 14000,
    servicios: ["almuerzo"],
    categorias: ["almuerzo"],
    disponible: true,
    para_llevar: true,
    url_imagen: null
  }
];

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await axios.get<MenuItem[]>(API_URL);
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    return mockMenuItems;
  }
};
