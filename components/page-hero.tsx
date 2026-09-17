import Image from "next/image";

export function PageHero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-[#081a3c] py-20 text-white lg:py-28">
      {image && <><Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35"/><div className="absolute inset-0 bg-gradient-to-r from-[#071a3c] via-[#071a3c]/90 to-[#071a3c]/35"/></>}
      <div className="beam-grid absolute inset-0 opacity-50"/>
      <div className="site-container relative z-10"><span className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[.18em] text-blue-200"><span className="h-px w-9 bg-blue-300"/>{eyebrow}</span><h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,7vw,5.8rem)] font-black leading-[.94] tracking-[-.055em]">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">{text}</p></div>
    </section>
  );
}
