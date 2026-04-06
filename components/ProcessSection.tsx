
import React from 'react';
import { MessageCircle, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

const ProcessSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">Un flujo impecable</h2>
          <p className="text-xl text-slate-600 font-light italic">"Sin fricción. Sin esperas. Solo resultados."</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12 items-center relative">
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="h-28 w-28 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform duration-500">
              <MessageCircle className="h-12 w-12" />
              <div className="absolute -top-3 -right-3 h-8 w-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black">1</div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Entrada de Operación</h3>
            <p className="text-slate-500 text-sm max-w-[240px]">Un operador contacta por WhatsApp o Email.</p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="h-36 w-36 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-200 flex items-center justify-center text-white mb-8 group-hover:scale-105 transition-transform duration-500 relative">
               <Cpu className="h-16 w-16 animate-pulse" />
               <div className="absolute -top-3 -right-3 h-8 w-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black">2</div>
               {/* Animated rings */}
               <div className="absolute inset-0 border-4 border-blue-400/30 rounded-[2.5rem] animate-ping opacity-20"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Gestión Hades</h3>
            <p className="text-slate-500 text-sm max-w-[240px]">La IA cotiza, revalida stock y cierra la reserva al instante.</p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="h-28 w-28 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-center text-green-500 mb-8 group-hover:scale-110 transition-transform duration-500">
              <CheckCircle className="h-12 w-12" />
              <div className="absolute -top-3 -right-3 h-8 w-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black">3</div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Confirmación</h3>
            <p className="text-slate-500 text-sm max-w-[240px]">Tú recibes la reserva ya confirmada y pagada en tu sistema.</p>
          </div>

          {/* Background Decorative arrows for desktop */}
          <div className="hidden lg:block absolute top-14 left-[28%] w-[10%] opacity-20">
            <ArrowRight className="h-12 w-full text-slate-400" />
          </div>
          <div className="hidden lg:block absolute top-14 right-[28%] w-[10%] opacity-20">
            <ArrowRight className="h-12 w-full text-slate-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
