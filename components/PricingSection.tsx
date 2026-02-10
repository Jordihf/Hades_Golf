
import React from 'react';
import { Check, Info, Zap } from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Asistente Básico",
      price: "150",
      desc: "Operativa pura de reservas.",
      features: [
        "Gestión operativa",
        "Integración WhatsApp + Email",
        "Atención 24/7",
        "Soporte prioritario"
      ]
    },
    {
      name: "Asistente Comercial",
      price: "190",
      desc: "Proactividad en ventas IA.",
      featured: true,
      features: [
        "Todo lo del Básico",
        "Venta comercial activa",
        "Gestión de ofertas",
        "Seguimiento comercial"
      ]
    },
    {
      name: "Agente Internacional",
      price: "290",
      desc: "Operación global completa.",
      features: [
        "Todo lo del Comercial",
        "Turoperación Europea",
        "Pagos internacionales",
        "Gestión de grupos"
      ]
    }
  ];

  return (
    <section id="precios" className="py-24 bg-mesh relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6">Planes Directos</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Automatización escalable diseñada para cualquier tamaño de club.
          </p>
          <div className="mt-8 inline-flex items-center space-x-2 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
            <Info className="h-4 w-4 text-blue-400" />
            <span>Setup Inicial: 250€ (pago único)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`relative p-10 rounded-[3rem] flex flex-col transition-all duration-500 hover:scale-[1.02] ${
              plan.featured 
              ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30' 
              : 'bg-white text-slate-900 border border-slate-100 shadow-xl'
            }`}>
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center space-x-2">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <span>Súper Recomendado</span>
                </div>
              )}
              
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.featured ? 'text-blue-100' : 'text-slate-500'}`}>{plan.desc}</p>
              
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}€</span>
                  <span className={`ml-2 text-sm font-medium ${plan.featured ? 'text-blue-200' : 'text-slate-400'}`}>/mes</span>
                </div>
                <p className={`text-[10px] font-bold mt-3 uppercase tracking-wider ${plan.featured ? 'text-blue-200' : 'text-blue-600'}`}>
                   {(parseInt(plan.price) * 0.75).toFixed(0)}€/mes con promo 25%
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.featured ? 'text-blue-200' : 'text-green-500'}`} />
                    <span className="font-medium">{f}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                plan.featured 
                ? 'bg-white text-blue-600 hover:bg-slate-50' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                Contratar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-[2.5rem] p-10 text-center max-w-3xl mx-auto shadow-sm">
          <h4 className="text-2xl font-bold text-blue-900 mb-4">¡Solo quedan 20 plazas con promo!</h4>
          <p className="text-blue-700 mb-8 font-light">Consigue un 25% de descuento de por vida para tu club si eres de los primeros 20 en unirte.</p>
          <div className="flex items-center justify-center space-x-4">
             <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden"><img src={`https://i.pravatar.cc/40?u=${i}`} alt="user" /></div>)}
             </div>
             <p className="text-sm font-bold text-blue-800 uppercase tracking-widest">20 Plazas Disponibles Hoy</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
