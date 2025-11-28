// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Tournament from './pages/Tournament';
import SchedulePage from './pages/Schedule';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col text-gray-100 bg-gradient-to-br from-[#05040b] via-[#070313] to-[#020915]">
      <Navbar />

      <main className="flex-1 pt-20 px-4 md:px-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
