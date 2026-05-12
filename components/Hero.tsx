
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-2/3 h-full opacity-10 blur-3xl bg-blue-400 rounded-full translate-x-1/3 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 animate-pulse">
            <Sparkles className="h-3 w-3" />
            <span>Oferta: -25% de por vida para los primeros 20 clubs</span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-extrabold text-slate-900 tracking-tight leading-[1] mb-8">
            Vende más Golf. <br/> <span className="text-gradient">Gestiona menos emails.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed font-light">
            Automatiza tu turoperación con un <span className="font-bold text-slate-900">Asistente Comercial de IA</span> que cierra reservas 24/7 mientras tu equipo se centra en el campo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#precios" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center group">
              Reservar mi Plaza
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#precios" className="w-full sm:w-auto glass-card text-slate-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/80 transition flex items-center justify-center">
              Ver Planes y Precios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
