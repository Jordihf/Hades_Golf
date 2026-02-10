
import React from 'react';

const PainSection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-6">
          Tu mayor problema no es vender golf. <br/>
          <span className="text-blue-600">Es gestionar reservas.</span>
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-slate-600 mb-12">
            Muchos clubs no tienen fuerza comercial dedicada, no entienden cómo funciona la turoperación internacional o simplemente no tienen el ancho de banda necesario. El resultado es simple: <span className="font-bold text-slate-900 underline decoration-blue-500 underline-offset-4">no venden todo lo que podrían.</span>
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition group">
                <div className="h-2 w-12 bg-blue-600 mb-6 rounded-full group-hover:w-20 transition-all"></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sin fuerza comercial</h3>
                <p className="text-sm text-slate-500">Carecer de un equipo dedicado a la venta proactiva frena tu crecimiento internacional.</p>
             </div>
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition group">
                <div className="h-2 w-12 bg-blue-600 mb-6 rounded-full group-hover:w-20 transition-all"></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Desconocimiento Turoperación</h3>
                <p className="text-sm text-slate-500">El mercado europeo tiene sus reglas. Si no las dominas, te quedas fuera de juego.</p>
             </div>
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition group">
                <div className="h-2 w-12 bg-blue-600 mb-6 rounded-full group-hover:w-20 transition-all"></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Atención a destiempo</h3>
                <p className="text-sm text-slate-500">Responder un lunes a un correo del viernes es regalarle el cliente a tu competencia.</p>
             </div>
          </div>
        </div>
      </div>
      
      {/* Abstract patterns */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full -z-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
};

export default PainSection;
