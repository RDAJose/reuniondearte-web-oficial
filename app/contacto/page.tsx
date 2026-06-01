import { siteConfig } from "@/lib/config/site";

const LAST_UPDATED = "1 de junio de 2026";

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Contacto editorial</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Contacto
      </h1>

      <div className="mt-8 space-y-6 border-t border-stone-300 pt-6 leading-8 text-stone-700">
        <p>
          Última actualización: <strong>{LAST_UPDATED}</strong>.
        </p>
        <p>
          Para contacto editorial, prensa, festivales, críticas, colaboraciones,
          derechos de imagen o contenido, privacidad, datos personales, propuestas
          culturales y posibles patrocinios futuros, escribe a:
        </p>
        <p>
          <a className="font-semibold text-stone-950 underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Usos del contacto</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Contacto editorial y consultas sobre contenidos publicados.</li>
          <li>Prensa, festivales, estrenos, libros, exposiciones y propuestas culturales.</li>
          <li>Derechos de imagen, autoría, correcciones o solicitudes de retirada.</li>
          <li>Privacidad, protección de datos y gestión de comentarios.</li>
          <li>Colaboraciones, publicidad o patrocinios futuros.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Colaboraciones y monetización futura
        </h2>
        <p>
          {siteConfig.name} puede estudiar propuestas editoriales, culturales, de prensa,
          festivales, colaboraciones y patrocinios. Cualquier colaboración comercial,
          contenido patrocinado o enlace afiliado se identificará claramente cuando
          exista. No hay pagos, anuncios ni afiliación activos desde esta página.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Sin formulario</h2>
        <p>
          Actualmente no se ofrece formulario de contacto para no recoger más datos de
          los necesarios. El canal principal es el email indicado.
        </p>
      </div>
    </section>
  );
}
