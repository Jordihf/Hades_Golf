
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
