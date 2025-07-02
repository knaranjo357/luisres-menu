import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Award, ChefHat, Sparkles } from 'lucide-react';
import { restaurantConfig, formatCurrentDate } from '../utils/dateUtils';

const Header: React.FC = () => {
  const { info } = restaurantConfig;

  const scrollToMenu = () => {
    const menuElement = document.getElementById('menu-items');
    if (menuElement) {
      menuElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="relative overflow-hidden">
      {/* Background optimizado */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-fixed transform scale-110"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-wood-dark/95 via-wood-dark/90 to-wood-dark/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      
      {/* Floating decorative elements optimizados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 w-3 h-3 bg-gold rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-32 right-16 w-2 h-2 bg-gold rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-gold rounded-full"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Awards badges optimizados */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 bg-gradient-to-r from-gold/30 to-gold/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gold/40 shadow-glow"
            >
              <Award size={18} className="text-gold" />
              <span className="text-sm text-cream font-bold">Tradición Culinaria</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 bg-gradient-to-r from-gold/30 to-gold/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gold/40 shadow-glow"
            >
              <Star size={18} className="text-gold" />
              <span className="text-sm text-cream font-bold">Ingredientes Frescos</span>
            </motion.div>
          </motion.div>
          
          {/* Main title optimizado */}
          <motion.h1 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-cream mb-8 tracking-tight relative"
          >
            <span className="bg-gradient-to-r from-cream via-gold to-cream bg-clip-text text-transparent drop-shadow-2xl">
              Luis Res
            </span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -top-4 -right-4 text-gold"
            >
              <Sparkles size={32} className="md:w-12 md:h-12" />
            </motion.div>
          </motion.h1>
          
          {/* Subtitle optimizado */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-3xl lg:text-4xl text-cream/95 max-w-4xl mx-auto font-light leading-relaxed mb-8 text-shadow-lg"
          >
            Donde la tradición culinaria cobra vida con cada bocado
          </motion.p>
          
          {/* Enhanced description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg md:text-xl text-cream/85 max-w-3xl mx-auto leading-relaxed mb-10 text-shadow"
          >
            Más de una década sirviendo los sabores auténticos de Santander con 
            ingredientes frescos y recetas que pasan de generación en generación.
          </motion.p>

          {/* CTA Button optimizado */}
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              boxShadow: "0 20px 40px rgba(212, 175, 55, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToMenu}
            className="bg-gradient-to-r from-gold via-gold/90 to-gold hover:from-gold/90 hover:via-gold hover:to-gold/90 text-wood-dark font-bold py-5 px-10 rounded-3xl shadow-luxury hover:shadow-glow-strong transition-all duration-300 mb-16 flex items-center gap-4 text-xl border-2 border-gold/30 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChefHat size={28} />
            </motion.div>
            <span>Explorar Nuestro Menú</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </motion.button>
          
          {/* Info Cards optimizadas */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl text-sm"
          >
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 text-cream/90 bg-gradient-to-br from-wood-medium/30 to-wood-medium/20 backdrop-blur-sm p-6 rounded-2xl border border-gold/20 shadow-luxury"
            >
              <div className="p-3 bg-gold/20 rounded-xl">
                <MapPin size={24} className="text-gold" />
              </div>
              <div className="text-left">
                <p className="font-bold text-cream mb-2 text-lg">📍 Nuestra Ubicación</p>
                <p className="leading-relaxed text-cream/80">{info.address}</p>
                <p className="text-gold text-sm mt-1 font-medium">Fácil acceso y parqueadero</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 text-cream/90 bg-gradient-to-br from-wood-medium/30 to-wood-medium/20 backdrop-blur-sm p-6 rounded-2xl border border-gold/20 shadow-luxury"
            >
              <div className="p-3 bg-gold/20 rounded-xl">
                <Clock size={24} className="text-gold" />
              </div>
              <div className="text-left">
                <p className="font-bold text-cream mb-2 text-lg">🕐 Horarios de Atención</p>
                <p className="text-cream/80">🌅 Almuerzo: 11:00 AM - 3:00 PM</p>
                <p className="text-cream/80">🌙 Cena: 6:00 PM - 9:00 PM</p>
                <p className="text-gold text-sm mt-1 font-medium">Martes a Domingo</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Date indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-cream/60 text-sm"
          >
            📅 {formatCurrentDate()}
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;