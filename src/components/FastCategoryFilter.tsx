import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, Sparkles } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

const FastCategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useMenu();
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [originalOffsetTop, setOriginalOffsetTop] = useState(0);

  useEffect(() => {
    if (elementRef.current) {
      setOriginalOffsetTop(elementRef.current.offsetTop);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const serviceBannerHeight = 80;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeSticky = scrollTop >= (originalOffsetTop - serviceBannerHeight - 10);
      
      setIsSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [originalOffsetTop]);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  // Memoize sorted categories for better performance
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [categories]);

  // Super fast animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -8, 
      scale: 0.98,
      transition: { duration: 0.1 }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.1, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.01,
      transition: { duration: 0.1 }
    },
    tap: { 
      scale: 0.99,
      transition: { duration: 0.05 }
    }
  };

  return (
    <>
      {/* Spacer for sticky positioning */}
      {isSticky && <div className="h-[88px] md:h-[80px]" />}
      
      <div 
        ref={elementRef}
        className={`transition-all duration-150 ${
          isSticky 
            ? 'fixed top-[80px] left-0 right-0 z-40 bg-wood-dark shadow-luxury' 
            : 'relative z-20 bg-cream py-6 mb-8 rounded-3xl shadow-luxury border border-gold/20'
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Mobile dropdown - Super optimized */}
          <div className="md:hidden">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full px-6 py-4 rounded-2xl flex items-center justify-between group transition-all duration-150 ${
                isSticky 
                  ? 'bg-wood-medium text-cream shadow-glow border-2 border-gold/30' 
                  : 'bg-white text-wood-dark shadow-luxury hover:shadow-glow border-2 border-gold/20 hover:border-gold/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl transition-all duration-150 ${
                  isSticky 
                    ? 'bg-gold/30 shadow-inner' 
                    : 'bg-gold/20 shadow-inner'
                }`}>
                  <Filter size={18} className="text-gold" />
                </div>
                <div className="text-left">
                  <span className={`font-bold text-lg block ${
                    isSticky ? 'text-cream' : 'text-wood-dark'
                  }`}>
                    {selectedCategory || 'Todas las categorías'}
                  </span>
                  <span className={`text-sm ${
                    isSticky ? 'text-cream/80' : 'text-wood-medium'
                  }`}>
                    {categories.length} categorías disponibles
                  </span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.1 }}
                className="p-1"
              >
                <ChevronDown size={24} className={`${isSticky ? 'text-cream/90' : 'text-wood-dark'} transition-colors`} />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className={`absolute left-4 right-4 mt-3 rounded-2xl shadow-luxury-lg z-50 overflow-hidden border-2 ${
                    isSticky 
                      ? 'bg-wood-dark border-gold/30' 
                      : 'bg-white border-gold/20'
                  }`}
                >
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCategoryClick(null)}
                    className={`w-full px-6 py-4 text-left transition-all duration-100 border-b ${
                      selectedCategory === null 
                        ? 'bg-gold/20 font-bold shadow-inner' 
                        : 'hover:bg-gold/10'
                    } ${
                      isSticky 
                        ? 'text-cream hover:text-cream border-gold/20' 
                        : 'text-wood-dark hover:text-wood-dark border-gold/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={16} className="text-gold" />
                      <span className="font-semibold">Todas las categorías</span>
                    </div>
                  </motion.button>
                  {sortedCategories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full px-6 py-4 text-left capitalize transition-all duration-100 border-b border-opacity-50 ${
                        selectedCategory === category
                          ? 'bg-gold/20 font-bold shadow-inner'
                          : 'hover:bg-gold/10'
                      } ${
                        isSticky 
                          ? 'text-cream hover:text-cream border-gold/20' 
                          : 'text-wood-dark hover:text-wood-dark border-gold/10'
                      }`}
                    >
                      <span className="font-medium">{category}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop horizontal scroll - Optimized */}
          <div className={`hidden md:flex items-center gap-4 overflow-x-auto scrollbar-hidden ${
            isSticky ? 'py-4' : 'pb-2'
          }`}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setSelectedCategory(null)}
              className={`px-8 py-4 rounded-2xl whitespace-nowrap font-bold transition-all duration-150 shadow-luxury border-2 ${
                selectedCategory === null
                  ? 'bg-gold text-white shadow-glow border-gold scale-105'
                  : isSticky
                    ? 'bg-wood-medium text-cream border-gold/30 hover:bg-gold/20 hover:border-gold/50 hover:shadow-glow'
                    : 'bg-white text-wood-dark border-gold/20 hover:bg-gold/10 hover:border-gold/40 hover:shadow-glow hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={18} className={selectedCategory === null ? 'text-white' : 'text-gold'} />
                Todas
              </div>
            </motion.button>
            
            {sortedCategories.map((category) => (
              <motion.button
                key={category}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCategoryClick(category)}
                className={`px-8 py-4 rounded-2xl whitespace-nowrap font-bold capitalize transition-all duration-150 shadow-luxury border-2 ${
                  selectedCategory === category
                    ? 'bg-gold text-white shadow-glow border-gold scale-105'
                    : isSticky
                      ? 'bg-wood-medium text-cream border-gold/30 hover:bg-gold/20 hover:border-gold/50 hover:shadow-glow'
                      : 'bg-white text-wood-dark border-gold/20 hover:bg-gold/10 hover:border-gold/40 hover:shadow-glow hover:scale-105'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FastCategoryFilter;