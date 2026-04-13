"use client";

import Image from "next/image";
import { Droplet, ShieldCheck, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { openModal } from "./Modal";
import { openPriceModal } from "./PriceModal";

export default function Nails() {
  return (
    <section
      id="nails"
      data-scroll-color-id="nails"
      className="relative py-32 px-4 md:px-10 overflow-hidden bg-background"
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full -z-10 opacity-10">
        <Image
          src="/img/manikur.webp"
          alt="Фон маникюр"
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-20 text-center" data-reveal="slide-up">
          <Sparkles className="w-10 h-10 text-accent mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
            Маникюр и педикюр:
            <br className="hidden md:block" />
            эстетика до кончиков пальцев
          </h2>
          <p className="text-lg md:text-xl max-w-2xl opacity-80 leading-relaxed">
            От классики до сложного дизайна. Мы заботимся не только о красоте, 
            но и о вашем здоровье, соблюдая строгие стандарты безопасности.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/40 backdrop-blur-xl border border-white/50 p-10 rounded-3xl shadow-sm flex flex-col items-center text-center h-full cursor-pointer transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:bg-white/60 will-change-transform" data-reveal="fade" data-reveal-delay="200ms">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent transition-transform duration-500 ease-in-out group-hover:scale-110">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl mb-4 transition-colors duration-300 group-hover:text-accent">3-этапная стерилизация</h3>
            <p className="opacity-80 leading-relaxed transition-opacity duration-300 group-hover:opacity-100">
              Абсолютная безопасность. Инструменты проходят дезинфекцию, ПСО и стерилизацию в сухожаре по нормам СанПиН. Крафт-пакет вскрывается при вас.
            </p>
          </div>

          <div className="group bg-accent/10 backdrop-blur-xl border border-accent/20 p-10 rounded-3xl shadow-sm flex flex-col items-center text-center h-full cursor-pointer transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:bg-accent/20 will-change-transform" data-reveal="fade" data-reveal-delay="400ms">
            <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center mb-6 transition-transform duration-500 ease-in-out group-hover:scale-110">
              <Droplet className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl mb-4 transition-colors duration-300 group-hover:text-accent">Smart-педикюр</h3>
            <p className="opacity-80 leading-relaxed transition-opacity duration-300 group-hover:opacity-100">
              Инновационная техника обработки стоп смарт-диском. Идеальная гладкость, которая сохраняется дольше, чем после классического педикюра.
            </p>
          </div>

          <div className="group bg-white/40 backdrop-blur-xl border border-white/50 p-10 rounded-3xl shadow-sm flex flex-col items-center text-center h-full cursor-pointer transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:bg-white/60 will-change-transform" data-reveal="fade" data-reveal-delay="600ms">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent transition-transform duration-500 ease-in-out group-hover:scale-110">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl mb-4 transition-colors duration-300 group-hover:text-accent">Премиум покрытия</h3>
            <p className="opacity-80 leading-relaxed transition-opacity duration-300 group-hover:opacity-100">
              Работаем только на сертифицированных гипоаллергенных материалах от ведущих мировых брендов. Гарантия на покрытие.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6" data-reveal="fade" data-reveal-delay="800ms">
          <MagneticButton 
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center bg-foreground text-background px-10 py-4 rounded-full font-medium w-full sm:w-auto"
          >
            Записаться на маникюр
          </MagneticButton>
          
          <MagneticButton 
            type="button"
            onClick={openPriceModal}
            className="inline-flex items-center justify-center bg-transparent border-2 border-foreground text-foreground px-10 py-4 rounded-full font-medium w-full sm:w-auto text-center"
          >
            Узнать стоимость
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
