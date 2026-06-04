import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

export const metadata: Metadata = {
  title: "Suscribirse a Reunión de Arte",
  description:
    "Recibe nuevos artículos de cine, arte, música, libros y cultura en tu correo.",
};

export default function SuscribirsePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-5 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <div className="border-t-2 border-stone-950 pt-4">
          <p className="editorial-kicker">Newsletter</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-stone-950 sm:text-6xl">
            Suscribirse a Reunión de Arte
          </h1>
          <div className="mt-6 space-y-5 text-base leading-8 text-stone-700 sm:text-lg">
            <p>
              La suscripción es gratuita y sirve para recibir avisos de nuevos artículos
              publicados en la revista.
            </p>
            <p>
              Usamos doble confirmación: después de enviar tu email recibirás un correo
              para confirmar que quieres suscribirte.
            </p>
            <p>
              No vendemos tus datos ni los usamos para publicidad. Puedes darte de baja
              desde cualquier correo recibido.
            </p>
          </div>
        </div>

        <NewsletterSignup />
      </div>
    </section>
  );
}
