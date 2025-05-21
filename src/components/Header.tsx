import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-restaurant-pattern bg-cover bg-center relative">
      <div className="absolute inset-0 bg-wood-dark/70"></div>
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-cream font-title">Luis Res</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;