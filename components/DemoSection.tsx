
import React from 'react';
import { Play } from 'lucide-react';

const DemoSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 lg:p-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Verlo en acción lo cambia todo</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-xl">
              En menos de 2 minutos puedes ver cómo el asistente responde a un operador, da precio real, guarda una operación y cierra una reserva automáticamente.
            </p>
            <a href="mailto:info@hadesgolf.com?subject=Quiero%20información%20sobre%20Hades%20Golf" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 inline-flex items-center justify-center mx-auto lg:mx-0">
               Quiero información
            </a>
          </div>
          
          <div className="flex-1 w-full max-w-xl relative">
            <div className="aspect-video bg-slate-800 rounded-3xl border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/golf-demo/800/450" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Demo preview" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-300">
                   <Play className="h-8 w-8 fill-white ml-1" />
                 </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/60 text-xs font-mono">
                 <span>PREVIEW_DEMO_V2.MP4</span>
                 <span>01:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
