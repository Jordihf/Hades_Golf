export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  author: string;
  category: string;
  imageUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "presentacion-soluciones-hades-ia",
    title: "Hades Golf: Presentando la Nueva Era de la IA para Campos de Golf",
    excerpt: "Descubre nuestro ecosistema de agentes inteligentes diseñados específicamente para resolver los retos diarios de los campos de golf, automatizando procesos y aumentando ingresos.",
    content: [
      "La gestión de un campo de golf es una tarea compleja que requiere equilibrar la atención al socio, la promoción comercial, la gestión de turoperadores y la operativa diaria. En Hades Golf, hemos desarrollado una suite de soluciones de Inteligencia Artificial para simplificar todo esto.",
      "Nos enorgullece presentar nuestro ecosistema de múltiples agentes especializados. A diferencia de un chatbot genérico, Hades es capaz de actuar proactivamente. Contamos con agentes especializados en ventas B2C, gestión de turoperadores, atención al cliente 24/7, fidelización de socios y operaciones de pro-shop.",
      "Entendemos que cada club es único. Por eso, nuestros agentes se pueden integrar a la medida de tus necesidades, conectándose con tu software de gestión actual para reducir la carga administrativa y abrir nuevos canales de ingresos de forma 100% automatizada.",
      "Bienvenido a la nueva era de la gestión deportiva. Bienvenido a Hades Golf."
    ],
    date: "09 Mar, 2026",
    author: "Equipo de Hades Golf",
    category: "Lanzamientos",
    imageUrl: "/presentacion-hades.png"
  },
  {
    id: "agente-comunicacion-socios-fidelizacion",
    title: "Cómo el Agente de Comunicación a Socios redefine la fidelización en tu club",
    excerpt: "Mantener informados a los socios ya no tiene que ser una tarea manual. Nuestro agente especializado redacta y envía comunicaciones hiper-personalizadas en cuestión de segundos.",
    content: [
      "Uno de los grandes dolores de cabeza de los directores de clubes de golf es mantener una comunicación fluida y constante con su base social. Redactar newsletters, avisos de torneos o recordatorios de cuotas consume horas de tiempo valioso.",
      "Nuestro Agente de Comunicación a Socios nace para solucionar este problema. A partir de directrices muy simples, el agente genera correos electrónicos perfectamente redactados, con el tono y la voz del club.",
      "Pero va mucho más allá. Puede segmentar las comunicaciones según los intereses del jugador, felicitarles en su cumpleaños, o informar sobre el estado de un campo tras fuertes lluvias basándose en los datos en tiempo real.",
      "Con la implementación de este agente, nuestros clientes han mejorado su tasa de retención de socios y han liberado a su personal de secretaría para centrarse en aportar valor presencial en la Casa Club."
    ],
    date: "24 Mar, 2026",
    author: "Equipo de Hades Golf",
    category: "Soluciones",
    imageUrl: "/agente-comunicacion.png"
  },
  {
    id: "revolucion-b2b-agente-turoperadores",
    title: "Revolución B2B: Automatiza las ventas con Tour Operadores y Agencias Internacionales",
    excerpt: "El Agente de Turoperadores y el Agente Internacional se unen para identificar, negociar y cerrar ventas de green fees a nivel global sin intervención humana de tu equipo.",
    content: [
      "Expandir el alcance comercial a nivel internacional es clave para rentabilizar las temporadas bajas y medias. Sin embargo, negociar contratos con Tour Operadores (TTOO) y agencias de diferentes países requiere tiempo, paciencia y, a menudo, lidiar con diferentes idiomas y husos horarios.",
      "Hades aporta una solución integral mediante el Agente Internacional y el Agente de Turoperadores. El primero se encarga de las tareas de expansión: identifica turoperadores en Europa (Escandinavia, Reino Unido, Alemania...) y lanza campañas de captación B2B automatizadas.",
      "Una vez establecido el contacto, el Agente de Turoperadores toma el relevo. Conoce tus tarifas dinámicas, disponibilidad en tiempo real y reglas de negocio, siendo capaz de responder correos, enviar presupuestos e incluso realizar bloqueos y reservas directamente en tu software.",
      "El resultado es un campo de golf trabajando comercialmente en piloto automático 24/7 en cualquier idioma."
    ],
    date: "12 Abr, 2026",
    author: "Equipo de Hades Golf",
    category: "Ventas B2B",
    imageUrl: "/agente-turoperadores.png"
  },
  {
    id: "atencion-al-cliente-24-7",
    title: "Atención al Cliente 24/7: Por qué tu club necesita a Hades en la recepción digital",
    excerpt: "¿Cuántas veces al día te preguntan por el horario o el código de vestimenta? El agente de atención al cliente resuelve dudas instantáneas a cualquier hora del día y de la noche.",
    content: [
      "La recepción de un campo de golf suele estar saturada de consultas recurrentes. Llamadas telefónicas y correos preguntando '¿Tienen buggies disponibles hoy?', '¿Puedo llevar vaqueros al campo?' o '¿A qué hora cierra el restaurante?'.",
      "Esto interrumpe la atención de los clientes que están presencialmente en la Casa Club. El Agente de Atención al Cliente de Hades está entrenado con toda la base de conocimiento de tu club para responder de manera instantánea, amable y precisa a los clientes, a través de WhatsApp, la web o correo electrónico.",
      "Este agente no duerme, no enferma y puede atender miles de consultas simultáneas en diferentes idiomas, mejorando la experiencia de un turista que planea su viaje desde el otro extremo del mundo. Es la recepción digital que todo club del siglo XXI necesita."
    ],
    date: "28 Abr, 2026",
    author: "Equipo de Hades Golf",
    category: "Soporte",
    imageUrl: "/atencion-cliente.png"
  },
  {
    id: "maximizando-ticket-agentes-paquetizacion",
    title: "Aumenta el ticket medio con los Agentes de Paquetización y Pro-Shop",
    excerpt: "Descubre cómo cruzar ventas y gestionar el stock automáticamente generando paquetes de golf + hotel y animando las compras en la tienda del club.",
    content: [
      "Vender un green fee está muy bien, pero como directores sabemos que la rentabilidad de un campo mejora enormemente cuando aumentamos el ticket medio del jugador mediante ventas adicionales y servicios empaquetados.",
      "Para ello, el Agente de Paquetización monitoriza la ocupación y crea alianzas dinámicas: propone paquetes instantáneos de fin de semana combinando golf, alojamiento en hoteles colaboradores y mesa en el restaurante, promocionándolos automáticamente cuando hay exceso de salidas libres.",
      "De forma complementaria, el Agente Pro-Shop dinamiza la venta en tienda. ¿Liderazgo en rebajas de fin de temporada? ¿Promociones especiales en palos por un torneo próximo? El agente se encarga de darle salida a ese stock mediante campañas B2C personalizadas a los socios y visitantes recientes.",
      "Trabajar de forma sinérgica con los agentes de Hades convierte tu club en una máquina perfectamente optimizada para la rentabilidad."
    ],
    date: "05 May, 2026",
    author: "Equipo de Hades Golf",
    category: "Estrategia Comercial",
    imageUrl: "/agente-paquetizacion.png"
  }
];
