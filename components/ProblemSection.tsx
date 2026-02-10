
import React from 'react';

const ProblemSection: React.FC = () => {
  return (
    <section id="problema" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-6">
            El coste de <span className="text-blue-600">no responder</span> a tiempo
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Las oportunidades se enfrían en minutos. Si no respondes ahora, el turoperador se va al siguiente campo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Oportunidades Perdidas */}
          <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col justify-between hover:shadow-xl transition-all group">
            <div className="mb-4">
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[75%] animate-pulse"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Oportunidades Perdidas</p>
              <p className="text-4xl font-black text-red-500">75%</p>
            </div>
          </div>

          {/* Card 2: Tiempo de Respuesta */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col justify-center text-white hover:scale-105 transition-transform">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tiempo de respuesta</p>
            <p className="text-2xl font-bold leading-tight">Reducido a <span className="text-blue-400">segundos</span></p>
          </div>

          {/* Card 3: Mercado Europeo */}
          <div className="bg-blue-600 p-8 rounded-[2.5rem] flex flex-col justify-end text-white hover:scale-105 transition-transform shadow-xl shadow-blue-200">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Mercado Europeo</p>
            <p className="text-2xl font-bold leading-tight tracking-tight">Acceso directo sin barreras</p>
          </div>

          {/* Card 4: Crecimiento */}
          <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col justify-between hover:shadow-xl transition-all">
            <div className="flex items-end space-x-2 mb-4 h-12">
              <div className="w-3 bg-blue-100 h-1/2 rounded-t-sm"></div>
              <div className="w-3 bg-blue-200 h-2/3 rounded-t-sm"></div>
              <div className="w-3 bg-blue-400 h-3/4 rounded-t-sm"></div>
              <div className="w-3 bg-blue-600 h-full rounded-t-sm animate-bounce"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Crecimiento Mensual</p>
              <p className="text-4xl font-black text-blue-600">+42%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
