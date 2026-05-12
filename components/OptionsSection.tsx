
import React, { useRef } from 'react';
import { 
  Users, 
  Tag, 
  Globe, 
  Briefcase, 
  Building, 
  Star, 
  Headset, 
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const agents = [
  {
    id: 1,
    icon: <Users className="h-6 w-6" />,
    title: "Agente de Comunicación a Socios",
    category: "FIDELIZACIÓN",
    description: "Manda emails personalizados a los socios con las últimas novedades, próximos torneos, eventos sociales y circulares importantes.",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: 2,
    icon: <Tag className="h-6 w-6" />,
    title: "Agente Comercial B2C",
    category: "VENTAS",
    description: "Envía ofertas puntuales a la base de datos de clientes, promocionando green fees invendidos u ofertando ventajas exclusivas para captar nuevos socios.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-100",
    textColor: "text-emerald-700"
  },
  {
    id: 3,
    icon: <Globe className="h-6 w-6" />,
    title: "Agente Internacional",
    category: "EXPANSIÓN",
    description: "Se encarga de identificar, contactar y negociar contratos automatizados con turoperadores de golf a nivel internacional en su idioma.",
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    id: 4,
    icon: <Briefcase className="h-6 w-6" />,
    title: "Agente de Turoperadores",
    category: "GESTIÓN",
    description: "Agiliza y administra los contratos con turoperadores, actualizando precios, verificando disponibilidades y cerrando ventas B2B.",
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
    textColor: "text-orange-700"
  },
  {
    id: 5,
    icon: <Building className="h-6 w-6" />,
    title: "Agente de Paquetización",
    category: "ALIANZAS",
    description: "Coordina disponibilidad con hoteles cercanos y compone paquetes conjuntos (alojamiento + golf) atrayendo turismo de calidad.",
    color: "bg-rose-500",
    lightColor: "bg-rose-100",
    textColor: "text-rose-700"
  },
  {
    id: 6,
    icon: <Star className="h-6 w-6" />,
    title: "Agente Red Golfy",
    category: "PROMOCIÓN",
    description: "Diseña paquetes específicos para el ecosistema Golfy y configura atractivas promociones tipo 'Coup de Coeur' maximizando visibilidad.",
    color: "bg-amber-500",
    lightColor: "bg-amber-100",
    textColor: "text-amber-700"
  },
  {
    id: 7,
    icon: <Headset className="h-6 w-6" />,
    title: "Atención al Cliente",
    category: "SOPORTE 24/7",
    description: "Resuelve instantáneamente dudas recurrentes: horarios, dress-code, información de alquileres y menús actualizados del restaurante.",
    color: "bg-cyan-500",
    lightColor: "bg-cyan-100",
    textColor: "text-cyan-700"
  },
  {
    id: 8,
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "Agente Pro-Shop",
    category: "RETAIL",
    description: "Anima la tienda del club dando a conocer las últimas colecciones de material, descuentos en palos y novedades en ropa deportiva.",
    color: "bg-pink-500",
    lightColor: "bg-pink-100",
    textColor: "text-pink-700"
  }
];

const OptionsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth + 100 : current.offsetWidth - 100;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="opciones" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Ecosistema de Agentes</h2>
            <p className="text-xl text-slate-600 font-light">
              Descubre las múltiples facetas de nuestra IA. Puedes componer tu equipo ideal delegando tareas específicas en agentes expertos y especializados.
            </p>
          </div>
          <div className="hidden md:flex space-x-3 mt-6 md:mt-0">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Carousel Container */}
        <div className="relative -mx-4 sm:mx-0">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 pt-4 px-4 sm:px-0 space-x-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className="snap-start shrink-0 w-[85vw] sm:w-[400px] bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${agent.lightColor} rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
                
                <div className="relative z-10 flex-1">
                  <div className={`inline-flex items-center space-x-2 ${agent.lightColor} ${agent.textColor} px-3 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wide`}>
                    {agent.category}
                  </div>
                  
                  <div className={`w-14 h-14 rounded-2xl ${agent.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-${agent.color}/30 transform group-hover:rotate-6 transition-transform`}>
                    {agent.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">{agent.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light text-base">
                    {agent.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Scroll Controls */}
          <div className="flex md:hidden justify-center space-x-4 mt-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
};

export default OptionsSection;
