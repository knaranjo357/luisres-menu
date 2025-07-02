import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Heart, Star, Award, ChefHat } from 'lucide-react';
import { restaurantConfig, formatCurrentDate } from '../utils/dateUtils';

const Footer: React.FC = () => {
  const { info } = restaurantConfig;

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${info.whatsapp}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${info.phone}`, '_self');
  };

  return (
    <footer className="bg-gradient-to-br from-wood-dark via-wood-dark to-wood-medium text-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full"></div>
        <div className="absolute bottom-16 right-16 w-24 h-24 border border-gold rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Restaurant Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gold/20 rounded-2xl">
                <ChefHat size={32} className="text-gold" />
              </div>
              <h3 className="text-4xl font-bold font-title text-gold">Luis Res</h3>
            </div>
            
            <p className="text-cream/90 text-lg leading-relaxed mb-6 max-w-md">
              Más de una década sirviendo los sabores auténticos de Santander con 
              ingredientes frescos y recetas tradicionales que pasan de generación en generación.
            </p>

            {/* Awards */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gold/10 px-3 py-2 rounded-full border border-gold/30">
                <Award size={16} className="text-gold" />
                <span className="text-sm font-medium">Tradición Culinaria</span>
              </div>
              <div className="flex items-center gap-2 bg-gold/10 px-3 py-2 rounded-full border border-gold/30">
                <Star size={16} className="text-gold" />
                <span className="text-sm font-medium">Ingredientes Frescos</span>
              </div>
            </div>

            <p className="text-cream/80 text-sm">
              📅 {formatCurrentDate()}
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xl font-bold mb-6 text-gold font-title">Contacto</h4>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppClick}
                className="flex items-start gap-3 text-cream/90 hover:text-cream transition-all duration-200 w-full text-left p-3 rounded-xl hover:bg-gold/10"
              >
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm opacity-80">{info.whatsapp}</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePhoneClick}
                className="flex items-start gap-3 text-cream/90 hover:text-cream transition-all duration-200 w-full text-left p-3 rounded-xl hover:bg-gold/10"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Phone size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Teléfono</p>
                  <p className="text-sm opacity-80">{info.phone}</p>
                </div>
              </motion.button>

              <div className="flex items-start gap-3 text-cream/90 p-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <MapPin size={20} className="text-red-400" />
                </div>
                <div>
                  <p className="font-semibold">Ubicación</p>
                  <p className="text-sm opacity-80 leading-relaxed">{info.address}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-xl font-bold mb-6 text-gold font-title">Horarios</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-cream/90 p-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Clock size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold">Almuerzo</p>
                  <p className="text-sm opacity-80">11:00 AM - 3:00 PM</p>
                  <p className="text-xs opacity-60">Martes a Domingo</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-cream/90 p-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Clock size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold">Cena</p>
                  <p className="text-sm opacity-80">6:00 PM - 9:00 PM</p>
                  <p className="text-xs opacity-60">Martes a Sábado</p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4">
                <p className="text-red-300 text-sm font-medium">
                  ⚠️ Cerrado los Lunes
                </p>
                <p className="text-red-300/80 text-xs">
                  Día de descanso del personal
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gold/20 mt-12 pt-8 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/80 text-sm">
              © 2024 Luis Res. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center gap-2 text-cream/80">
              <span className="text-sm">Hecho con</span>
              <Heart size={16} className="text-red-400 animate-pulse" />
              <span className="text-sm">para nuestros clientes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;