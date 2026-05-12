
import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

const Footer: React.FC = () => {
  // Get the two most recent posts (assuming the array is chronologically sorted, latest at the end)
  const recentPosts = [...blogPosts].reverse().slice(0, 2);

  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-50 pb-12">
          {/* Logo and Copyright */}
          <div className="md:col-span-4">
            <span className="text-2xl font-extrabold tracking-tighter text-blue-600">
              HADES <span className="text-slate-900">GOLF</span>
            </span>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Impulsado por Inteligencia Artificial Comercial para el sector del Golf. Redefiniendo la forma en que los clubes interactúan, venden y fidelizan.
            </p>
          </div>

          {/* Site Links */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-slate-900 mb-4">Enlaces</h4>
            <div className="flex flex-col space-y-3">
              <Link to="/#solucion" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Solución</Link>
              <Link to="/#opciones" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Opciones</Link>
              <Link to="/#precios" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Precios</Link>
              <Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Blog</Link>
              <Link to="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Contacto</Link>
            </div>
          </div>
          
          {/* Recent Blog Posts */}
          <div className="md:col-span-5">
            <h4 className="font-bold text-slate-900 mb-4">Últimas Novedades</h4>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="flex items-center group">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center mr-4">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h5>
                    <p className="text-xs text-slate-400 mt-1">{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2026 Hades Golf. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Aviso Legal</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Privacidad</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
