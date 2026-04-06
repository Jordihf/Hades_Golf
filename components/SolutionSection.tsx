
import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

const SolutionSection: React.FC = () => {
  return (
    <section id="solucion" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <span>La Solución Hades</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-extrabold mb-8 leading-[1.1] tracking-tighter">
              El asistente que <br/><span className="text-blue-500 italic">siempre</span> responde.
            </h2>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
              No es un software complejo. Es un comercial digital que entiende el mercado del golf y trabaja codo con codo con tu equipo actual.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Respuesta al milisegundo", desc: "La IA cotiza y responde al instante cualquier petición." },
                { title: "Stock revalidado", desc: "Conexión directa con tu disponibilidad real de campo." },
                { title: "Multilingüe", desc: "Atención experta en inglés, alemán y más mercados clave." }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4 group">
                  <div className="h-10 w-10 rounded-2xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-blue-600 transition-colors duration-500">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-10 bg-blue-600/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
            <div className="relative bg-slate-800 border border-slate-700 p-10 rounded-[3.5rem] shadow-3xl shadow-black/50 overflow-hidden group">
              <div className="flex items-center space-x-5 mb-10">
                <div className="h-14 w-14 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Impacto Hades</p>
                  <p className="text-2xl font-black tracking-tight text-white">Eficiencia +85%</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>Carga Operativa</span>
                    <span className="text-blue-400">Eliminada</span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full p-1 shadow-inner">
                    <div className="h-full bg-blue-600 rounded-full w-[85%] shadow-lg shadow-blue-500/50"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mt-10">
                  <div className="p-6 bg-slate-900 rounded-[2rem] border border-slate-700 text-center group-hover:border-blue-500/50 transition-colors">
                    <p className="text-4xl font-black text-blue-500 mb-1">0s</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Espera</p>
                  </div>
                  <div className="p-6 bg-slate-900 rounded-[2rem] border border-slate-700 text-center group-hover:border-blue-500/50 transition-colors">
                    <p className="text-4xl font-black text-blue-500 mb-1">24/7</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Servicio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
