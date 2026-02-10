
import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';

const CTAFinal: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 -z-0 w-64 h-64 bg-blue-600/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
              ¿Listo para dar el salto?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
              Únete a los clubs que ya están automatizando su venta. Recuerda: solo quedan <span className="text-blue-400 font-bold">20 plazas</span> con el 25% de descuento de por vida.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 flex items-center justify-center group">
                Reservar mi Plaza
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto glass-card border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Hablar con Ventas
              </button>
            </div>
            
            <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest font-bold">
              Cuota de configuración inicial de 250€ incluida en la contratación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAFinal;
