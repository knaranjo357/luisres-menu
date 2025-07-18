import React from 'react';
import Header from './components/Header';
import MenuImageViewer from './components/MenuImageViewer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-premium-gradient">
      <Header />
      <main className="flex-grow">
        <MenuImageViewer />
      </main>
    </div>
  );
}

export default App;