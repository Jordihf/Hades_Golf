
import React from 'react';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contacto" className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 bg-blue-50/50 rounded-[2.5rem] p-10 text-center flex flex-col items-center border border-blue-100/50 shadow-sm">
           <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-blue-600" />
           </div>
           <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">¿Prefieres escribirnos?</h3>
           <p className="text-lg text-slate-600 mb-8 max-w-lg font-light">
             Si tienes dudas sobre cómo podemos adaptar el agente a tu club de golf en específico, estamos a tu disposición.
           </p>
           <a href="mailto:info@hadesgolf.com?subject=Duda%20sobre%20Hades%20Golf" className="inline-flex items-center space-x-3 bg-white px-8 py-4 rounded-full text-blue-600 font-bold text-xl hover:bg-blue-600 hover:text-white transition-all shadow-md border border-slate-100 group">
              <Mail className="h-5 w-5" />
              <span>info@hadesgolf.com</span>
           </a>
        </div>
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
