import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { restaurantConfig } from '../utils/dateUtils';

const Header: React.FC = () => {
  const { info, schedule } = restaurantConfig;

  return (
    <header className="relative">
      <div className="bg-restaurant-pattern bg-cover bg-center h-[300px] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-wood-dark/80 to-wood-dark/95"></div>
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col h-full justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-cream font-title mb-4">
              Luis Res
            </h1>
            <p className="text-lg md:text-xl text-cream-light/90 max-w-2xl mx-auto font-light">
              Tradición y sabor en cada plato, una experiencia gastronómica única en Floridablanca
            </p>
            
            <div className="mt-8 flex flex-col md:flex-row items-center gap-6 text-cream-light/80">
              <div className="flex items-center gap-2">
                <MapPin className="text-accent" size={20} />
                <span>{info.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-accent" size={20} />
                <span>
                  {schedule.lunch.start} - {schedule.lunch.end} | {schedule.dinner.start} - {schedule.dinner.end}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;