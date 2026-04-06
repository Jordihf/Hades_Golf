
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-2xl font-extrabold tracking-tighter text-blue-600">
              HADES <span className="text-slate-900">GOLF</span>
            </span>
            <p className="text-slate-400 text-sm mt-2">© 2024 Hades Golf. Todos los derechos reservados.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Aviso Legal</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Privacidad</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Cookies</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">Contacto</a>
          </div>
          
          <div className="flex space-x-4">
             {/* Social links placeholder */}
             <div className="h-10 w-10 bg-slate-50 rounded-xl hover:bg-blue-50 transition border border-slate-100 cursor-pointer"></div>
             <div className="h-10 w-10 bg-slate-50 rounded-xl hover:bg-blue-50 transition border border-slate-100 cursor-pointer"></div>
             <div className="h-10 w-10 bg-slate-50 rounded-xl hover:bg-blue-50 transition border border-slate-100 cursor-pointer"></div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-300">Impulsado por Inteligencia Artificial Comercial para el sector del Golf.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
