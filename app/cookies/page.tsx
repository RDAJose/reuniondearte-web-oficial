import { siteConfig } from "@/lib/config/site";

const LAST_UPDATED = "2 de junio de 2026";

export default function CookiesPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
      <p className="editorial-kicker">Cookies</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
        Política de cookies
      </h1>

      <div className="mt-8 space-y-6 border-t border-stone-300 pt-6 leading-8 text-stone-700">
        <p>
          Ãšltima actualización: <strong>{LAST_UPDATED}</strong>.
        </p>
        <p>
          {siteConfig.name} puede usar Google Analytics 4 solo si la persona usuaria
          acepta expresamente la analítica. Si se rechaza o no existe una decisión
          previa, la analítica permanece desactivada y no se envían páginas vistas.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Tecnologías usadas actualmente
        </h2>
        <p>
          La web utiliza localStorage del navegador para recordar un identificador
          anónimo y el estado local de los likes por artículo. Esta información se guarda
          en el dispositivo de la persona usuaria y sirve para mantener una interacción
          básica sin crear cuentas, pedir email ni instalar servicios externos de
          seguimiento.
        </p>
        <p>
          También se utiliza localStorage para recordar la decisión sobre analítica:
          aceptación o rechazo. Esta decisión evita preguntar de nuevo en cada visita y
          no implica por sí misma el uso de cookies de Google.
        </p>
        <p>
          El navegador o los proveedores de alojamiento pueden usar elementos técnicos
          necesarios para servir la página, seguridad, disponibilidad o registro técnico
          básico.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Analítica opcional
        </h2>
        <p>
          Si se acepta la analítica, se carga Google Analytics 4 con el ID de medición
          G-021Z217Z8C. La finalidad es medir visitas, páginas vistas, dispositivos, país
          aproximado, fuentes de tráfico y rendimiento editorial. El proveedor es Google.
          No se activa publicidad, remarketing, Google Ads ni Google Tag Manager.
        </p>
        <p>
          Si se rechaza la analítica, se mantiene el consentimiento denegado y no se
          envían eventos de medición. La decisión puede modificarse borrando el
          almacenamiento local del navegador para este sitio.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Servicios externos y embeds
        </h2>
        <p>
          El código del sitio contempla embeds editoriales como YouTube en modo
          youtube-nocookie.com o Spotify cuando se insertan enlaces compatibles dentro de
          artículos. Si la persona usuaria interactúa con esos servicios, dichos
          proveedores pueden aplicar sus propias políticas de privacidad o cookies.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Gestión en el navegador
        </h2>
        <p>
          Puedes borrar localStorage y cookies desde la configuración de privacidad de
          tu navegador. Al hacerlo, el estado local de los likes puede reiniciarse.
        </p>

        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Tabla de cookies y tecnologías
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-300 text-stone-950">
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">Titular</th>
                <th className="py-2 pr-4">Finalidad</th>
                <th className="py-2 pr-4">Duración</th>
                <th className="py-2 pr-4">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stone-200">
                <td className="py-3 pr-4">rda:analytics-consent</td>
                <td className="py-3 pr-4">{siteConfig.name}</td>
                <td className="py-3 pr-4">Recordar aceptación o rechazo de analítica.</td>
                <td className="py-3 pr-4">Hasta borrado del navegador/localStorage.</td>
                <td className="py-3 pr-4">localStorage de consentimiento.</td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="py-3 pr-4">_ga, _ga_*</td>
                <td className="py-3 pr-4">Google</td>
                <td className="py-3 pr-4">
                  Medición agregada con Google Analytics 4, solo tras aceptación.
                </td>
                <td className="py-3 pr-4">Según configuración de Google Analytics.</td>
                <td className="py-3 pr-4">Analítica opcional de tercero.</td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="py-3 pr-4">rda:anonymous-client-id</td>
                <td className="py-3 pr-4">{siteConfig.name}</td>
                <td className="py-3 pr-4">Identificador anónimo para likes por navegador.</td>
                <td className="py-3 pr-4">Hasta borrado del navegador/localStorage.</td>
                <td className="py-3 pr-4">localStorage funcional.</td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="py-3 pr-4">rda:article-liked:slug</td>
                <td className="py-3 pr-4">{siteConfig.name}</td>
                <td className="py-3 pr-4">Recordar si un artículo fue marcado con â€œme gustaâ€.</td>
                <td className="py-3 pr-4">Hasta borrado del navegador/localStorage.</td>
                <td className="py-3 pr-4">localStorage funcional.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-serif text-2xl font-bold text-stone-950">Cambios futuros</h2>
        <p>
          Si en el futuro se incorporan publicidad, afiliación, remarketing u otros
          servicios de seguimiento, se solicitará consentimiento cuando sea necesario y
          esta política se actualizará antes de activar esos sistemas.
        </p>
      </div>
    </section>
  );
}

