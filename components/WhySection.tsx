
import React from 'react';
import { Zap, ShieldCheck, Rocket } from 'lucide-react';

const WhySection: React.FC = () => {
  const benefits = [
    { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Cero Integración", 
      desc: "Instalación inmediata. Sin tocar tu software actual ni cambiar procesos internos." 
    },
    { 
      icon: <ShieldCheck className="h-8 w-8" />, 
      title: "Respetamos tu Operativa", 
      desc: "No cambia cómo trabajas, solo elimina el error humano y la lentitud." 
    },
    { 
      icon: <Rocket className="h-8 w-8" />, 
      title: "Potencia tu Equipo", 
      desc: "Libera a tu staff de tareas mecánicas. Dales tiempo para lo que importa: el golf." 
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">¿Por qué Stellaris?</h2>
          <p className="text-slate-500 font-light text-xl">Tecnología diseñada para multiplicar la eficiencia comercial.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="group p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2 text-center">
              <div className="h-20 w-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform duration-500">
                {b.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{b.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed font-light">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
