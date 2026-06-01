import { siteConfig } from "@/lib/config/site";

const LAST_UPDATED = "1 de junio de 2026";
const PENDING_VALUE = "PENDIENTE_DE_COMPLETAR";

export default function AvisoLegalPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Información legal</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Aviso legal
      </h1>

      <div className="mt-8 space-y-6 border-t border-stone-300 pt-6 leading-8 text-stone-700">
        <p>
          Última actualización: <strong>{LAST_UPDATED}</strong>.
        </p>
        <p>
          {siteConfig.name} es una revista/web cultural dedicada a cine, música, arte,
          crítica, libros y cultura.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Titularidad</h2>
        <p>Titular del sitio web: {siteConfig.author}.</p>
        <p>Email: {siteConfig.email}.</p>
        <p>Dominio: reuniondearte.com.</p>
        <p>NIF: {PENDING_VALUE}.</p>
        <p>Domicilio: {PENDING_VALUE}.</p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Uso del sitio</h2>
        <p>
          El acceso a esta web tiene carácter informativo, cultural y editorial. La
          persona usuaria se compromete a utilizar el sitio de forma lícita, respetuosa
          y coherente con su finalidad.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Propiedad intelectual
        </h2>
        <p>
          Salvo indicación contraria, los textos, diseño, logotipos y contenidos propios
          publicados en {siteConfig.name} están protegidos por derechos de propiedad
          intelectual. No se permite su reproducción completa sin autorización previa.
          Las citas breves deberán respetar la autoría y enlazar la fuente.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Imágenes y materiales externos
        </h2>
        <p>
          Las imágenes y materiales visuales pueden ser propios, autorizados,
          procedentes de press kit, dominio público, licencias compatibles o fuentes
          citadas. Si detectas un posible problema de derechos, puedes escribir a{" "}
          <a className="font-semibold text-stone-950 underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>{" "}
          para solicitar revisión, corrección o retirada.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Responsabilidad</h2>
        <p>
          Los contenidos publicados tienen finalidad informativa, cultural, crítica o de
          opinión. {siteConfig.name} revisa sus contenidos, pero no garantiza la
          disponibilidad permanente del sitio ni se responsabiliza del contenido,
          políticas o funcionamiento de páginas externas enlazadas, que dependen de sus
          respectivos titulares.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Comentarios</h2>
        <p>
          Los comentarios están moderados. Podrán rechazarse, editarse parcialmente por
          razones técnicas o eliminarse si contienen spam, insultos, datos sensibles,
          contenido ilegal, ofensivo, discriminatorio, ajeno al tema o contrario al tono
          editorial del sitio.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Comunicaciones y retirada de contenidos
        </h2>
        <p>
          Puedes solicitar la corrección o retirada razonable de datos, comentarios,
          imágenes o contenidos escribiendo a {siteConfig.email}.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Monetización futura
        </h2>
        <p>
          La web puede aceptar propuestas editoriales, culturales, de prensa, festivales,
          colaboraciones, patrocinios, publicidad o afiliación en el futuro. Cualquier
          contenido patrocinado, colaboración comercial o enlace afiliado se identificará
          de forma clara cuando exista. Actualmente no se activan anuncios, pagos,
          afiliados ni scripts publicitarios desde este aviso.
        </p>
      </div>
    </section>
  );
}
