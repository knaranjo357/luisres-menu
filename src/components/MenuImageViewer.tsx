import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { getCurrentMenuImage } from '../config/menuConfig';

const MenuImageViewer: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const updateImage = () => {
      const image = getCurrentMenuImage();
      setCurrentImage(image);
      setIsImageLoaded(false);
    };

    // Actualizar imagen inmediatamente
    updateImage();

    // Actualizar cada minuto para cambios de horario
    const interval = setInterval(updateImage, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-3 py-6">
      {/* Barra de búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 max-w-md mx-auto"
      >
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wood-medium" />
          <input
            type="text"
            placeholder="Buscar platos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-wood-light/30 rounded-xl focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all text-sm shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-wood-medium hover:text-wood-dark transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Imagen del menú */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-4xl mx-auto"
      >
        {!isImageLoaded && (
          <div className="aspect-[3/4] bg-wood-light/10 rounded-xl animate-pulse flex items-center justify-center">
            <div className="text-wood-medium text-sm">Cargando menú...</div>
          </div>
        )}
        
        <img
          src={currentImage}
          alt="Menú del día"
          onLoad={handleImageLoad}
          className={`w-full h-auto rounded-xl shadow-lg transition-opacity duration-300 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
          style={{ 
            maxHeight: '80vh',
            objectFit: 'contain'
          }}
        />
      </motion.div>

      {/* Información adicional si hay búsqueda */}
      {searchTerm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-wood-medium text-sm">
            Buscando: "{searchTerm}" en el menú actual
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MenuImageViewer;