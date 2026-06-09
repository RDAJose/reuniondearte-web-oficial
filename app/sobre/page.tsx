import { AuthorsOverview } from "@/components/authors/AuthorsOverview";

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
      <section>
        <p className="editorial-kicker">Proyecto editorial</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
          Sobre Reunión de Arte
        </h1>
        <div className="mt-6 space-y-5 border-t border-stone-300 pt-6 leading-8 text-stone-700">
          <p>
            Reunión de Arte es un proyecto cultural independiente creado para reunir
            artículos sobre cine, música, arte, libros y pensamiento visual.
          </p>
          <p>
            Esta nueva web oficial se construye desde cero para ordenar el archivo,
            mejorar la lectura, conservar el contenido importante y publicar de forma
            limpia, estable y profesional.
          </p>
        </div>
      </section>

      <AuthorsOverview />
    </main>
  );
}
