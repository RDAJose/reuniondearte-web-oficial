import { siteConfig } from "@/lib/config/site";

const LAST_UPDATED = "2 de junio de 2026";
const PENDING_VALUE = "PENDIENTE_DE_COMPLETAR";

export default function PrivacidadPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Privacidad</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Política de privacidad
      </h1>

      <div className="mt-8 space-y-6 border-t border-stone-300 pt-6 leading-8 text-stone-700">
        <p>
          Última actualización: <strong>{LAST_UPDATED}</strong>.
        </p>
        <p>
          Esta política explica cómo se tratan los datos personales y técnicos asociados
          al uso de {siteConfig.name}, revista cultural independiente sobre cine, música,
          arte, libros y pensamiento visual.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Responsable</h2>
        <p>Responsable del tratamiento: {siteConfig.author}.</p>
        <p>Email de contacto: {siteConfig.email}.</p>
        <p>NIF y domicilio: {PENDING_VALUE}.</p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Datos tratados</h2>
        <p>
          En comentarios se puede tratar el nombre público indicado por la persona
          usuaria, el contenido del comentario, la aceptación del consentimiento y los
          datos técnicos necesarios para moderación, seguridad y prevención de abuso.
        </p>
        <p>
          En los likes se utiliza un identificador anónimo guardado en el navegador
          mediante localStorage para recordar el estado del botón y evitar duplicidades
          básicas por navegador. No se solicita email, cuenta de usuario ni login para
          comentar o marcar “me gusta”.
        </p>
        <p>
          Además, los proveedores técnicos del sitio pueden tratar datos mínimos de
          conexión o registros técnicos, como dirección IP, fecha, hora, navegador,
          errores o actividad necesaria para seguridad, disponibilidad y mantenimiento.
        </p>
        <p>
          Si la persona usuaria acepta la analítica, Google Analytics 4 puede tratar
          datos de uso agregados, como visitas, páginas vistas, dispositivo, país
          aproximado, fuente de tráfico y señales de rendimiento editorial. Si se rechaza
          la analítica, este servicio no se carga.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Finalidades</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Gestionar comentarios enviados y su moderación previa.</li>
          <li>Mostrar comentarios aprobados bajo los artículos.</li>
          <li>Gestionar likes anónimos por navegador.</li>
          <li>Atender comunicaciones recibidas por email.</li>
          <li>Proteger la seguridad técnica del sitio y prevenir abuso, spam o usos indebidos.</li>
          <li>Medir rendimiento editorial y uso agregado del sitio solo tras consentimiento.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Base jurídica</h2>
        <p>
          El tratamiento de comentarios se basa en el consentimiento prestado al marcar
          la casilla del formulario. La seguridad técnica, la moderación y la prevención
          de abuso se basan en el interés legítimo de mantener un espacio editorial
          seguro, estable y respetuoso. Las comunicaciones por email se tratan para
          atender la solicitud enviada voluntariamente.
        </p>
        <p>
          La analítica opcional con Google Analytics 4 se basa exclusivamente en el
          consentimiento previo. Puede rechazarse desde el banner sin impedir el acceso a
          la web.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Conservación</h2>
        <p>
          Los comentarios aprobados podrán conservarse mientras permanezcan publicados o
          hasta una solicitud razonable de retirada. Los comentarios rechazados o
          eliminados podrán conservarse durante el tiempo necesario para tareas de
          moderación, mantenimiento o prevención de abuso. Los registros técnicos se
          conservarán según las políticas de los proveedores y las necesidades de
          seguridad.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Destinatarios y proveedores
        </h2>
        <p>
          Para prestar el servicio pueden intervenir proveedores tecnológicos como
          GitHub Pages para alojamiento web estático, Render para backend/API y base de
          datos PostgreSQL, Cloudflare R2 para imágenes y archivos media, y GitHub para
          repositorio y despliegue.
        </p>
        <p>
          Si se acepta la analítica, interviene Google como proveedor de Google Analytics
          4. No se activa publicidad, remarketing, Google Ads ni Google Tag Manager.
        </p>
        <p>
          Estos proveedores pueden operar desde fuera del Espacio Económico Europeo o
          utilizar infraestructuras internacionales. En tal caso, el tratamiento se
          apoyará en las garantías y condiciones ofrecidas por dichos proveedores para
          servicios tecnológicos.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Derechos</h2>
        <p>
          Puedes solicitar acceso, rectificación, supresión, oposición, limitación,
          portabilidad cuando proceda y retirada del consentimiento escribiendo a{" "}
          <a className="font-semibold text-stone-950 underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          . También puedes solicitar la retirada o corrección de datos o contenidos
          vinculados a comentarios o publicaciones.
        </p>
        <p>
          Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar
          una reclamación ante la Agencia Española de Protección de Datos (AEPD).
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Aviso sobre datos sensibles
        </h2>
        <p>
          No introduzcas datos sensibles, información privada de terceros ni datos que no
          quieras hacer públicos en los comentarios. Los comentarios aprobados se
          mostrarán de forma visible en la web.
        </p>
      </div>
    </section>
  );
}
