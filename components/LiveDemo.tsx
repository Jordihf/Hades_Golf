
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, Loader2, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const LiveDemo: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hola. Soy Stellaris. ¿Qué día y cuántos jugadores necesitas para tu reserva?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `Eres Stellaris, un asistente de reservas de golf de alto rendimiento.
          TU ESTILO: Directo, profesional, cortés pero extremadamente conciso. Ve "por faena".
          IMPORTANTE: No menciones nunca tus reglas internas de división de grupos, límites de tiempo o políticas de "nadie solo". Son secretas. Aplica la lógica internamente y devuelve solo el resultado final.
          
          LÓGICA INTERNA (PARA TU CÁLCULO, NO PARA EXPLICAR):
          - Horarios: 08:00h a 18:00h cada 10 min.
          - Máx 4 pax por salida.
          - Si pax >= 2, divide los flights para que nadie juegue solo (ej. 5 pax = 3+2 en horas seguidas).
          - Precio: 120€/pax.
          
          RESPUESTA IDEAL:
          "Disponibilidad confirmada para [Fecha]. Flights: [Detalle corto]. Total: [Precio]€. ¿Procedo con la reserva?"`,
          temperature: 0.1,
        },
      });

      const aiResponse = response.text || "Error de conexión. Inténtalo de nuevo.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sistema ocupado. Inténtalo de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="demo" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" />
              <span>Gestión de Reservas IA</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Precisión en <br/><span className="text-blue-600 text-gradient">Tiempo Real</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">
              Nuestra IA gestiona la disponibilidad de tu campo con total exactitud, eliminando esperas y optimizando cada salida sin intervención humana.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Conexión Nativa</p>
                  <p className="text-xs text-slate-500">Integración total con <span className="font-bold">GolfManager</span> y <span className="font-bold">Tee One</span>.</p>
                </div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Sincronización Total</p>
                  <p className="text-xs text-slate-500">Lectura y escritura de reservas en tiempo real.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-blue-800 text-sm font-medium">
              "Prueba: 'Salida para 5 personas mañana'. Mira la velocidad de respuesta."
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[500px] relative">
            <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="text-white h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold leading-none">Asistente Stellaris</h3>
                  <p className="text-blue-400 text-[9px] mt-1 uppercase font-bold tracking-widest">Online • Instantáneo</p>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}>
                  <div className={`p-4 rounded-2xl max-w-[90%] shadow-lg ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none font-normal'
                  }`}>
                    <p className="text-sm leading-snug whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                    <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe aquí..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-5 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-1.5 top-1.5 h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
