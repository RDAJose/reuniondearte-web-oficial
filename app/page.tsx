import Link from "next/link";

const featuredSections = [
  {
    title: "Cine",
    description: "Crítica, memoria visual, festivales, películas vistas y análisis cultural.",
  },
  {
    title: "Música",
    description: "Álbumes, escenas, artistas, entrevistas y cultura sonora.",
  },
  {
    title: "Arte",
    description: "Pintura, imagen, patrimonio, iconografía y pensamiento visual.",
  },
  {
    title: "Libros",
    description: "Lecturas, ensayos, literatura, librerías y cultura editorial.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Revista cultural independiente
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-neutral-950 md:text-7xl">
          Cine, música, arte y libros desde una mirada propia.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-700">
          Reunión de Arte es un proyecto editorial dedicado a escribir,
          ordenar y conservar pensamiento cultural: artículos, crítica,
          entrevistas, relatos visuales y memoria artística.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/articulos"
            className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Ver artículos
          </Link>
          <Link
            href="/sobre"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-950"
          >
            Sobre el proyecto
          </Link>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-14 md:grid-cols-4">
          {featuredSections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{section.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Migración limpia, sin arrastrar WordPress
        </h2>
        <p className="mt-5 max-w-3xl leading-7 text-neutral-700">
          La nueva web se construye desde cero. Solo se rescatarán artículos
          valiosos, textos propios, imágenes necesarias, slugs importantes y
          contenido editorial revisado. Quedan fuera al inicio los RSS de audio,
          episodios de SoundCloud, Log Drum Series y Trip From Jose to South Africa.
        </p>
      </section>
    </div>
  );
}
