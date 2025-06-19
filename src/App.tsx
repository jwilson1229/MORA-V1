import React from 'react';
import PrimingCarouselWeb from './components/primingCarousel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../src/pages/dashboard';
export default function App() {
  return (
    <Router>
      <Routes>
<Route path="/" element={<PrimingCarouselWeb />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
