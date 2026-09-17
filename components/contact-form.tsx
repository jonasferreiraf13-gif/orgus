import { ArrowRight } from "lucide-react";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const inputClass =
    "focus-ring min-h-12 w-full rounded-lg border border-white/15 bg-white/8 px-4 text-base text-white placeholder:text-white/45";

  return (
    <form
      action="/api/contact"
      method="post"
      className={`grid gap-3 ${compact ? "sm:grid-cols-2" : ""}`}
    >
      <label className="sr-only" htmlFor={`contact-name-${compact}`}>Nome</label>
      <input id={`contact-name-${compact}`} className={inputClass} name="name" placeholder="Seu nome" minLength={2} maxLength={120} required />
      <label className="sr-only" htmlFor={`contact-email-${compact}`}>E-mail</label>
      <input id={`contact-email-${compact}`} className={inputClass} name="email" type="email" placeholder="Seu e-mail" maxLength={180} required />
      <label className="sr-only" htmlFor={`contact-phone-${compact}`}>Telefone</label>
      <input id={`contact-phone-${compact}`} className={inputClass} name="phone" placeholder="Telefone" maxLength={40} />
      <label className="sr-only" htmlFor={`contact-message-${compact}`}>Mensagem</label>
      <textarea id={`contact-message-${compact}`} className={`${inputClass} min-h-28 resize-y pt-3 ${compact ? "sm:col-span-2" : ""}`} name="message" placeholder="Como podemos ajudar?" minLength={5} maxLength={4000} required />
      <label className="hidden" aria-hidden="true">Não preencha este campo<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button className={`focus-ring flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 font-extrabold text-[#173e90] transition hover:bg-blue-50 ${compact ? "sm:col-span-2 sm:justify-self-start" : ""}`} type="submit">Enviar mensagem <ArrowRight size={17}/></button>
    </form>
  );
}
