import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Utensils, Sun, Moon, AlertCircle, Star } from 'lucide-react';
import { ServiceType } from '../types';
import { getDaySchedule, getRestaurantStatus, isServiceAvailable, getNextAvailableService } from '../utils/dateUtils';
import { useMenu } from '../context/MenuContext';

interface ServiceBannerProps {
  currentService: ServiceType;
}

const ServiceBanner: React.FC<ServiceBannerProps> = ({ currentService }) => {
  const { setSelectedService } = useMenu();
  const today = new Date();
  const schedule = getDaySchedule(today);
  const restaurantStatus = getRestaurantStatus(today);
  const lunchAvailable = isServiceAvailable('lunch', today);
  const dinnerAvailable = isServiceAvailable('dinner', today);
  const nextService = getNextAvailableService(today);
  
  // Si el restaurante está cerrado, mostrar información especial
  if (restaurantStatus.isClosed) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-30 bg-red-600 backdrop-blur-xl border-b-2 border-red-400/30 shadow-luxury"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div 
              layout
              className="flex items-center gap-3 text-white"
            >
              <div className="p-2.5 bg-white/20 rounded-xl">
                <AlertCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">
                  {restaurantStatus.isSpecialDay ? '🎉 Día Especial' : '⚠️ Restaurante Cerrado'}
                </p>
                <p className="text-white/90 text-sm">
                  {restaurantStatus.reason}
                </p>
                {nextService && (
                  <p className="text-white/80 text-xs mt-1">
                    Próximo servicio: {nextService.service === 'lunch' ? 'Almuerzo' : 'Cena'} 
                    {' '}{nextService.day} a las {nextService.schedule.start}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentSchedule = currentService === 'almuerzo' ? schedule.lunch : schedule.dinner;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-wood-dark backdrop-blur-xl border-b-2 border-gold/30 shadow-luxury"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Current service info */}
          <motion.div 
            layout
            className="flex items-center gap-3 text-cream"
          >
            <div className="p-2.5 bg-gradient-to-br from-gold/30 to-gold/20 rounded-xl shadow-inner border border-gold/30">
              <Clock size={20} className="text-gold" />
            </div>
            <div>
              <p className="font-bold text-lg flex items-center gap-2">
                <Utensils size={18} className="text-gold" />
                {currentService === 'almuerzo' ? 'Servicio de Almuerzo' : 'Servicio de Cena'}
                {restaurantStatus.isSpecialDay && (
                  <Star size={16} className="text-gold animate-pulse" />
                )}
              </p>
              <p className="text-cream/90 text-sm">
                {currentSchedule.start} - {currentSchedule.end}
                {restaurantStatus.isSpecialDay && (
                  <span className="ml-2 text-gold font-medium">
                    • {restaurantStatus.reason}
                  </span>
                )}
              </p>
            </div>
          </motion.div>
          
          {/* Service selector optimizado */}
          <div className="flex items-center bg-wood-medium/60 backdrop-blur-sm rounded-2xl p-1.5 border-2 border-gold/20 shadow-inner">
            <motion.button
              whileHover={lunchAvailable ? { scale: 1.02 } : {}}
              whileTap={lunchAvailable ? { scale: 0.98 } : {}}
              onClick={() => lunchAvailable && setSelectedService('almuerzo')}
              disabled={!lunchAvailable}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 text-sm font-bold border-2 ${
                currentService === 'almuerzo'
                  ? 'bg-gradient-to-r from-gold to-gold/90 text-white shadow-glow border-gold transform scale-105'
                  : lunchAvailable
                    ? 'text-cream hover:bg-gradient-to-r hover:from-gold/20 hover:to-gold/10 border-transparent hover:border-gold/30 hover:shadow-lg'
                    : 'opacity-40 cursor-not-allowed text-cream/50 border-transparent'
              }`}
            >
              <Sun size={18} className={currentService === 'almuerzo' ? 'text-white' : 'text-gold'} />
              <span className="hidden sm:inline">Almuerzo</span>
              <span className="sm:hidden">🌅</span>
              {!lunchAvailable && (
                <span className="text-xs opacity-60 hidden sm:inline">(No disp.)</span>
              )}
            </motion.button>
            
            <motion.button
              whileHover={dinnerAvailable ? { scale: 1.02 } : {}}
              whileTap={dinnerAvailable ? { scale: 0.98 } : {}}
              onClick={() => dinnerAvailable && setSelectedService('cena')}
              disabled={!dinnerAvailable}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 text-sm font-bold border-2 ${
                currentService === 'cena'
                  ? 'bg-gradient-to-r from-gold to-gold/90 text-white shadow-glow border-gold transform scale-105'
                  : dinnerAvailable
                    ? 'text-cream hover:bg-gradient-to-r hover:from-gold/20 hover:to-gold/10 border-transparent hover:border-gold/30 hover:shadow-lg'
                    : 'opacity-40 cursor-not-allowed text-cream/50 border-transparent'
              }`}
            >
              <Moon size={18} className={currentService === 'cena' ? 'text-white' : 'text-gold'} />
              <span className="hidden sm:inline">Cena</span>
              <span className="sm:hidden">🌙</span>
              {!dinnerAvailable && (
                <span className="text-xs opacity-60 hidden sm:inline">(No disp.)</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceBanner;