import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { menuConfig } from '../config/menuConfig';

const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center transform scale-110"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-wood-dark/90 via-wood-dark/85 to-wood-dark/80" />
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Main title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-cream mb-4 tracking-tight relative"
          >
            <span className="bg-gradient-to-r from-cream via-gold to-cream bg-clip-text text-transparent">
              {menuConfig.nombre}
            </span>
          </motion.h1>
          
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="p-3 bg-gold/20 rounded-xl">
              <ChefHat size={32} className="text-gold" />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;