import React from 'react';
import { Clock, Utensils, Sandwich } from 'lucide-react';
import { ServiceType } from '../types';
import { restaurantConfig, isDinnerAvailable } from '../utils/dateUtils';
import { useMenu } from '../context/MenuContext';

interface ServiceBannerProps {
  currentService: ServiceType;
}

const ServiceBanner: React.FC<ServiceBannerProps> = ({ currentService }) => {
  const { setSelectedService } = useMenu();
  const schedule = restaurantConfig.schedule[currentService === 'almuerzo' ? 'lunch' : 'dinner'];
  const dinnerAvailable = isDinnerAvailable();
  
  return (
    <div className="bg-wood-dark/90 text-cream sticky top-0 z-30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-accent" />
            <span>
              {currentService === 'almuerzo' ? (
                <>Servicio de Almuerzo: {schedule.start} - {schedule.end}</>
              ) : (
                <>Servicio de Cena: {schedule.start} - {schedule.end}</>
              )}
            </span>
          </div>
          
          <div className="flex items-center bg-cream/10 rounded-lg backdrop-blur-sm p-1">
            <button
              onClick={() => setSelectedService('almuerzo')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all text-sm ${
                currentService === 'almuerzo'
                  ? 'bg-cream text-wood-dark font-medium'
                  : 'text-cream hover:bg-cream/20'
              }`}
            >
              <Utensils size={16} />
              <span>Almuerzo</span>
            </button>
            
            <button
              onClick={() => setSelectedService('cena')}
              disabled={!dinnerAvailable}
              className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all text-sm ${
                !dinnerAvailable 
                  ? 'opacity-50 cursor-not-allowed text-cream/50' 
                  : currentService === 'cena'
                    ? 'bg-cream text-wood-dark font-medium'
                    : 'text-cream hover:bg-cream/20'
              }`}
            >
              <Sandwich size={16} />
              <span>Cena</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBanner;