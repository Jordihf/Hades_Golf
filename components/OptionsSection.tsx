
import React from 'react';
import { MessageSquare, Zap, Target, Users } from 'lucide-react';

const OptionsSection: React.FC = () => {
  return (
    <section id="opciones" className="py-24 bg-mesh overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Potencia tu Alcance</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">Adaptamos nuestra tecnología a la ambición comercial de tu club.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Option 1 */}
          <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200 border border-slate-100 flex flex-col hover:shadow-2xl transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold mb-6">
                <MessageSquare className="h-3 w-3" />
                <span>OPERATIVA</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Asistente de Reservas</h3>
              <p className="text-blue-600 font-semibold mb-8 uppercase tracking-wider text-sm">Para optimizar flujos actuales</p>
              
              <div className="space-y-8 mb-10">
                <div>
                  <p className="text-slate-900 font-bold mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-3 text-blue-500" /> ¿Qué hace?
                  </p>
                  <ul className="text-slate-500 space-y-3 pl-8 list-disc text-sm">
                    <li>Gestiona turoperadores habituales automáticamente.</li>
                    <li>Sincroniza stock y precios en tiempo real.</li>
                    <li>Libera al equipo de tareas administrativas.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-900 font-bold mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-3 text-blue-500" /> Ideal si...
                  </p>
                  <ul className="text-slate-500 space-y-3 pl-8 list-disc text-sm">
                    <li>Ya tienes turoperadores pero te saturan el email.</li>
                    <li>Quieres evitar errores en overbooking.</li>
                  </ul>
                </div>
              </div>
            </div>
            <button className="relative z-10 w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl">
              Elegir Asistente
            </button>
          </div>

          {/* Option 2 */}
          <div className="bg-slate-900 rounded-[3rem] p-12 shadow-xl shadow-blue-900/10 border border-slate-800 flex flex-col hover:shadow-2xl transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/50 rounded-bl-full -z-0 opacity-20 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1 text-white">
              <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold mb-6">
                <Users className="h-3 w-3" />
                <span>COMERCIAL</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-2">Agente Internacional</h3>
              <p className="text-blue-400 font-semibold mb-8 uppercase tracking-wider text-sm">Para expansión y nuevas ventas</p>
              
              <div className="space-y-8 mb-10">
                <div>
                  <p className="text-white font-bold mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-3 text-blue-400" /> ¿Qué hace?
                  </p>
                  <ul className="text-slate-400 space-y-3 pl-8 list-disc text-sm">
                    <li>Conecta proactivamente con turoperación Europea.</li>
                    <li>Lanza ofertas dinámicas y cierra acuerdos 24/7.</li>
                    <li>Mueve producto sin intervención humana.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-white font-bold mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-3 text-blue-400" /> Ideal si...
                  </p>
                  <ul className="text-slate-400 space-y-3 pl-8 list-disc text-sm">
                    <li>Quieres vender en el mercado internacional pero no sabes cómo.</li>
                    <li>Buscas escalar sin contratar fuerza de ventas fija.</li>
                  </ul>
                </div>
              </div>
            </div>
            <button className="relative z-10 w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition shadow-xl shadow-blue-500/20">
              Elegir Agente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptionsSection;
