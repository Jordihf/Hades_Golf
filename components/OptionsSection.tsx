
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
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Option 1: Plan Starter */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200 border border-slate-100 flex flex-col hover:shadow-2xl transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-1 rounded-full text-[10px] font-bold mb-6">
                <MessageSquare className="h-3 w-3" />
                <span>INFORMATIVO & PROMO</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Asistente Starter</h3>
              <p className="text-slate-500 font-semibold mb-8 uppercase tracking-wider text-xs">Para comunicación por email</p>
              
              <div className="space-y-6 mb-10">
                <div>
                  <p className="text-slate-900 font-bold mb-2 flex items-center text-sm">
                    <Zap className="h-4 w-4 mr-2 text-slate-400" /> ¿Qué hace?
                  </p>
                  <ul className="text-slate-500 space-y-2 pl-6 list-disc text-sm">
                    <li>Responde dudas generales por correo.</li>
                    <li>Envía promociones a tu BBDD depurada.</li>
                    <li>Filtra el correo basura y clasifica leads.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-900 font-bold mb-2 flex items-center text-sm">
                    <Target className="h-4 w-4 mr-2 text-slate-400" /> Ideal si...
                  </p>
                  <ul className="text-slate-500 space-y-2 pl-6 list-disc text-sm">
                    <li>Quieres automatizar respuestas repetitivas.</li>
                    <li>Buscas reactivar jugadores inactivos por email.</li>
                  </ul>
                </div>
              </div>
            </div>
            <a href="mailto:info@hadesgolf.com?subject=Quiero%20información%20sobre%20el%20Asistente%20Starter" className="relative z-10 block text-center w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition shadow-sm">
              Quiero información
            </a>
          </div>

          {/* Option 2: Plan PRO */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-900/5 border-2 border-blue-100 flex flex-col hover:-translate-y-2 transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-80 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[10px] font-bold mb-6">
                <Zap className="h-3 w-3" />
                <span>ATENCIÓN OMNICANAL</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Asistente PRO</h3>
              <p className="text-blue-600 font-semibold mb-8 uppercase tracking-wider text-xs">Para dominar WhatsApp y Web</p>
              
              <div className="space-y-6 mb-10">
                <div>
                  <p className="text-slate-900 font-bold mb-2 flex items-center text-sm">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" /> ¿Qué hace?
                  </p>
                  <ul className="text-slate-500 space-y-2 pl-6 list-disc text-sm">
                    <li>Atención instantánea por WhatsApp y Chatbot web.</li>
                    <li>Resuelve el 90% de las dudas antes de que llamen.</li>
                    <li>Clasifica los "Leads" y filtra el ruido.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-900 font-bold mb-2 flex items-center text-sm">
                    <Target className="h-4 w-4 mr-2 text-blue-500" /> Ideal si...
                  </p>
                  <ul className="text-slate-500 space-y-2 pl-6 list-disc text-sm">
                    <li>El teléfono del club no para de sonar con dudas básicas.</li>
                    <li>Quieres dar una imagen premium y moderna.</li>
                  </ul>
                </div>
              </div>
            </div>
            <a href="mailto:info@hadesgolf.com?subject=Quiero%20información%20sobre%20el%20Asistente%20PRO" className="relative z-10 block text-center w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-500/20">
              Quiero información
            </a>
          </div>

          {/* Option 3: Equipo de Ventas */}
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-blue-900/20 border border-slate-800 flex flex-col hover:-translate-y-2 transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/50 rounded-bl-full -z-0 opacity-20 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1 text-white">
              <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-1 rounded-full text-[10px] font-bold mb-6">
                <Users className="h-3 w-3" />
                <span>MULTICANAL & PAGOS</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2">Equipo de Ventas</h3>
              <p className="text-blue-400 font-semibold mb-8 uppercase tracking-wider text-xs">Reservas B2B / B2C Autónomas</p>
              
              <div className="space-y-6 mb-10">
                <div>
                  <p className="text-white font-bold mb-2 flex items-center text-sm">
                    <Zap className="h-4 w-4 mr-2 text-blue-400" /> ¿Qué hace?
                  </p>
                  <ul className="text-slate-400 space-y-2 pl-6 list-disc text-sm">
                    <li>Gestiona múltiples agentes (Operadores, Clientes).</li>
                    <li>Cierra reservas en tiempo real y realiza cobros.</li>
                    <li>Contacta y negocia con Turoperadores.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-white font-bold mb-2 flex items-center text-sm">
                    <Target className="h-4 w-4 mr-2 text-blue-400" /> Ideal si...
                  </p>
                  <ul className="text-slate-400 space-y-2 pl-6 list-disc text-sm">
                    <li>Quieres aumentar la facturación directamente.</li>
                    <li>Pierdes ventas por tardar en confirmar reservas.</li>
                  </ul>
                </div>
              </div>
            </div>
            <a href="mailto:info@hadesgolf.com?subject=Quiero%20información%20sobre%20el%20Equipo%20de%20Ventas" className="relative z-10 block text-center w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition shadow-xl border border-slate-700">
              Quiero información
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptionsSection;
