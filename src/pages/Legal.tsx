import React from 'react';
import site from '../data/site.json';
import { CONTACT_ON, LEGAL_ON } from '../lib/flags';

const { legal } = site;

const Holder: React.FC = () =>
  LEGAL_ON ? (
    <ul>
      <li>Titular: {legal.holder}</li>
      <li>Número de identificación fiscal: {legal.taxId}</li>
      <li>Registro: {legal.registryName}</li>
      <li>Domicilio: {legal.address}</li>
      <li>
        Correo: <a href={`mailto:${legal.email}`}>{legal.email}</a>
      </li>
    </ul>
  ) : (
    <p>Los datos del titular de esta web todavía no están publicados en esta página.</p>
  );

const Page: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="section page legal" aria-labelledby="legal-title">
    <div className="wrap narrow">
      <h1 id="legal-title">{title}</h1>
      {children}
    </div>
  </section>
);

export const AvisoLegal: React.FC = () => (
  <Page title="Aviso legal">
    <h2 className="h3">Titular</h2>
    <Holder />
    {LEGAL_ON && legal.brandNote && <p>{legal.brandNote}</p>}
    <h2 className="h3">Qué es esta web</h2>
    {CONTACT_ON ? (
      <p>
        hadesgolf.com es una web informativa. No tiene formularios que envíen información a ningún servidor ni cobra nada: si quieres
        pedirnos tu Radiografía o una propuesta, se abre tu programa de correo con el texto ya escrito y tú decides si lo envías. Lo que
        nos escribas se trata como explica la <a href="/privacidad/">política de privacidad</a>.
      </p>
    ) : (
      <p>
        hadesgolf.com es una web informativa. No recoge datos personales, no tiene formularios que envíen información a ningún
        servidor y no cobra nada.
      </p>
    )}
    <h2 className="h3">Contenidos</h2>
    <p>
      Las cifras que publicamos indican su contexto y su fecha. Los ejemplos marcados como «Datos de ejemplo» son inventados y no
      corresponden a ningún campo real.
    </p>
  </Page>
);

export const Privacidad: React.FC = () => (
  <Page title="Política de privacidad">
    <h2 className="h3">Responsable</h2>
    <Holder />
    <h2 className="h3">Qué datos tratamos</h2>
    <p>
      Esta web no tiene cuentas de usuario. El configurador funciona entero en tu navegador: tus elecciones solo se guardan en el
      enlace de tu plan{CONTACT_ON ? ', y solo nos llegan si nos lo envías por correo.' : ', y no nos llegan.'}
    </p>
    {CONTACT_ON && (
      <>
        <h2 className="h3">Si nos escribes</h2>
        <ul>
          <li>Datos: tu correo y lo que nos cuentes (por ejemplo, el nombre del club, la persona de contacto y su teléfono).</li>
          <li>Para qué: responderte y prepararte la Radiografía y la propuesta que nos pides.</li>
          <li>Base jurídica: tu propia petición, como paso previo a un posible contrato (art. 6.1.b del RGPD).</li>
          <li>
            Quién lo ve: el comercial de Hades que te atiende y los proveedores de correo y de IA que usamos para preparar la
            Radiografía y la propuesta, que actúan por encargo nuestro.
          </li>
          <li>
            Transferencias internacionales: algunos de esos proveedores están en Estados Unidos. Solo trabajamos con los que ofrecen
            garantías reconocidas por la Unión Europea (Marco de Privacidad de Datos UE-EE. UU. o cláusulas contractuales tipo).
          </li>
          <li>Cuánto tiempo: lo necesario para atender tu petición y, después, los plazos que marca la ley.</li>
        </ul>
      </>
    )}
    <h2 className="h3">Alojamiento</h2>
    <p>
      La web está alojada en GitHub Pages, un servicio de GitHub, Inc. en Estados Unidos. Como cualquier servidor web, GitHub registra
      la dirección IP de quien visita la página por motivos de seguridad, según su propia política de privacidad.
    </p>
    <h2 className="h3">Cookies y analítica</h2>
    <p>
      No usamos cookies ni herramientas de analítica. Si algún día añadimos un contador de visitas, lo diremos aquí antes.
    </p>
    <h2 className="h3">Tus derechos</h2>
    {LEGAL_ON || CONTACT_ON ? (
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a{' '}
        {LEGAL_ON ? legal.email : site.contactEmail}. También puedes reclamar ante la Agencia Española de Protección de Datos
        (aepd.es).
      </p>
    ) : (
      <p>
        Esta web no recoge datos personales tuyos. Si crees que tratamos algún dato tuyo, puedes reclamar ante la Agencia Española de
        Protección de Datos (aepd.es).
      </p>
    )}
  </Page>
);

export const Cookies: React.FC = () => (
  <Page title="Cookies">
    <p>No usamos cookies.</p>
    <p>
      Tampoco usamos analítica, scripts de terceros ni fuentes externas: todo lo que carga esta web se sirve desde la propia web. El
      configurador guarda tus elecciones solo en el enlace de tu plan.
    </p>
  </Page>
);

export const NotFound: React.FC = () => (
  <Page title="Esta página no existe">
    <p>Puede que el enlace sea antiguo. Las páginas del antiguo blog ya no están publicadas.</p>
    <p>
      <a href="/" className="btn">Ir a la portada</a>
    </p>
  </Page>
);
