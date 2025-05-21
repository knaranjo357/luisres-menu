import React from 'react';
import { Phone, MapPin, Clock, Send } from 'lucide-react';
import { restaurantConfig } from '../utils/dateUtils';

const Footer: React.FC = () => {
  const { info, schedule } = restaurantConfig;
  
  return (
    <footer className="bg-wood-dark text-cream-light mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-cream mb-4 font-title">Luis Res</h3>
            <p className="mb-4">
              Deliciosa comida tradicional con el sabor único que solo Luis Res puede ofrecer.
              Visítanos y disfruta de una experiencia gastronómica inolvidable.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-cream mb-4 font-title">Información</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-accent" />
                <span>{info?.address}</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-accent" />
                <a href={`tel:${info?.phone}`} className="hover:text-accent transition-colors">
                  {info?.phone}
                </a>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mr-2 mt-1 text-accent" />
                <div>
                  <p>Martes a Domingo:</p>
                  {schedule && (
                    <>
                      <p>Almuerzo: {schedule.lunch.start} - {schedule.lunch.end}</p>
                      <p>Cena: {schedule.dinner.start} - {schedule.dinner.end}</p>
                    </>
                  )}
                  <p className="text-amber-400">Lunes: Cerrado</p>
                  <p className="text-amber-400">Domingos: Solo almuerzo</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-cream mb-4 font-title">Pedidos</h4>
            <p className="mb-4">
              Para hacer tu pedido, puedes llamarnos o escribirnos por WhatsApp.
              Estaremos encantados de atenderte.
            </p>
            <div className="space-y-3">
              <a 
                href={`https://wa.me/${info?.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition-colors w-full justify-center"
              >
                <Send size={18} />
                WhatsApp
              </a>
              <a 
                href={`tel:${info?.phone}`}
                className="inline-flex items-center gap-2 bg-accent text-wood-dark font-semibold py-2 px-4 rounded hover:bg-cream transition-colors w-full justify-center"
              >
                <Phone size={18} />
                Llamar
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-wood-light/30 mt-8 pt-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Luis Res Restaurant. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;