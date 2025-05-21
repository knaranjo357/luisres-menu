import React from 'react';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import Footer from './components/Footer';

function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-cream-light">
          <Header />
          <CategoryFilter />
          <main className="flex-grow">
            <MenuList />
          </main>
          <Cart />
          <Footer />
        </div>
      </CartProvider>
    </MenuProvider>
  );
}

export default App;