"use client";

import { ShieldCheck, Sparkles, Heart, Clock } from "lucide-react";

const benefits = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Стерильно",
    desc: "3-этапная стерилизация и крафт-пакеты.",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Качественно",
    desc: "Только премиальные и гипоаллергенные материалы.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Уютно",
    desc: "Чай, кофе и расслабляющая атмосфера.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Удобно",
    desc: "Быстрая запись и удобное расположение.",
  },
];

export default function Advantages() {
  return (
    <section className="py-24 px-4 md:px-10 bg-white/60">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center font-heading text-4xl md:text-5xl mb-16">
          Почему выбирают нас
        </h2>

        <div className="adv-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-background border border-accent/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="font-heading text-xl mb-3">{item.title}</h3>
              <p className="opacity-70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
