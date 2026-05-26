const categories = ["Cine", "Música", "Arte", "Libros", "Cultura"];

export default function CategoriasPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
        Categorías
      </h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <div key={category} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold">{category}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}
