import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useMenu();
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 100); // Adjust this value as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <div className={`bg-cream-light py-4 z-20 transition-all duration-300 ${
      isSticky ? 'fixed top-0 left-0 right-0 shadow-md' : ''
    }`}>
      <div className="container mx-auto px-4">
        {/* Mobile dropdown */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 bg-cream text-wood-dark border-2 border-wood-light/30 rounded-lg flex items-center justify-between"
          >
            <span className="font-medium">
              {selectedCategory ? selectedCategory : 'Todas las categorías'}
            </span>
            <ChevronDown
              size={20}
              className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isOpen && (
            <div className="absolute left-4 right-4 mt-2 py-2 bg-cream rounded-lg shadow-lg border border-wood-light/10 z-30">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full px-4 py-2 text-left ${
                  selectedCategory === null ? 'bg-wood-light/10 text-wood-dark' : 'text-wood-medium'
                }`}
              >
                Todas las categorías
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full px-4 py-2 text-left capitalize ${
                    selectedCategory === category
                      ? 'bg-wood-light/10 text-wood-dark'
                      : 'text-wood-medium'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop horizontal scroll */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full border-2 whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-wood-medium text-cream border-wood-medium'
                : 'bg-cream text-wood-dark border-wood-light/30 hover:border-wood-light'
            }`}
          >
            Todos
          </motion.button>
          
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full border-2 whitespace-nowrap capitalize ${
                selectedCategory === category
                  ? 'bg-wood-medium text-cream border-wood-medium'
                  : 'bg-cream text-wood-dark border-wood-light/30 hover:border-wood-light'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;