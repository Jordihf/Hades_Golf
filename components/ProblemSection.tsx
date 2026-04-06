
import React from 'react';
import { Clock, Zap, ArrowRight, UserX, Bot } from 'lucide-react';

const ProblemSection: React.FC = () => {
  return (
    <section id="problema" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h2 className="text-4xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
          La diferencia es <br/><span className="text-gradient">la velocidad</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
          En el golf de turoperación, el primero que responde es el que se queda con el tee time.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card: El Problema (Manual) */}
          <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-red-100">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                  <UserX size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Gestión Manual</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">El pozo de las oportunidades</h3>
              <p className="text-slate-500 font-light leading-relaxed mb-8">
                Emails que esperan al lunes, llamadas perdidas y turoperadores que se cansan de esperar.
              </p>
            </div>

            <div className="relative h-24 bg-white/50 rounded-2xl p-6 flex items-center border border-slate-100 overflow-hidden">
              <div className="flex items-center space-x-4 w-full">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-red-400 w-1/4 animate-pulse"></div>
                </div>
                <span className="text-sm font-bold text-red-500 whitespace-nowrap">Respuesta: +24h</span>
              </div>
              {/* Animation of lead falling off */}
              <div className="absolute right-10 top-0 bottom-0 flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <div className="mt-8 text-5xl font-black text-slate-200 group-hover:text-red-500/10 transition-colors">
              75% Lost
            </div>
          </div>

          {/* Card: La Solución (Hades) */}
          <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-between text-white shadow-2xl shadow-blue-900/20 group relative overflow-hidden">
            {/* Ambient light animation */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Hades IA</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Eficiencia instantánea</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-8">
                Cotización, revalidación y reserva en tiempo real. 24/7, sin descansos ni errores.
              </p>
            </div>

            <div className="relative z-10 h-24 bg-slate-800/50 rounded-2xl p-6 flex items-center border border-slate-700 overflow-hidden">
              <div className="flex items-center space-x-4 w-full">
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full w-full animate-flow"></div>
                </div>
                <span className="text-sm font-bold text-blue-400 whitespace-nowrap">Respuesta: <span className="animate-pulse">Segundos</span></span>
              </div>
              {/* Flowing particles animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="particle-container">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="particle bg-blue-400/30" style={{ animationDelay: `${i * 0.4}s` }}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-5xl font-black text-blue-500/10 group-hover:text-blue-500/30 transition-colors relative z-10">
              100% Attended
            </div>
          </div>

        </div>

        {/* Simplified Value Stat Bar */}
        <div className="mt-12 bg-blue-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between border border-blue-100">
           <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Zap size={24} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Impacto Real</p>
                <p className="text-slate-900 font-bold text-lg">Multiplica x3 tu capacidad comercial sin contratar a nadie.</p>
              </div>
           </div>
           <button className="flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-700 transition group">
              <span>Ver cómo funciona</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      <style>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .animate-flow {
          animation: flow 1s ease-out forwards;
        }
        .particle-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        .particle {
          position: absolute;
          height: 2px;
          width: 20px;
          border-radius: full;
          top: 50%;
          left: -20px;
          opacity: 0;
          animation: particle-move 2s linear infinite;
        }
        @keyframes particle-move {
          0% { transform: translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(600px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default ProblemSection;
