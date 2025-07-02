import React from 'react';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ServiceBanner from './components/ServiceBanner';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { useMenu } from './context/MenuContext';

// Component to access menu context
const AppContent: React.FC = () => {
  const { selectedService } = useMenu();
  
  return (
    <div className="min-h-screen flex flex-col bg-premium-gradient">
      <Header />
      <ServiceBanner currentService={selectedService} />
      <main className="flex-grow">
        <MenuList />
      </main>
      <Cart />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </MenuProvider>
  );
}

export default App;