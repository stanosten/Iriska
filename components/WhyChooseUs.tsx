"use client";

import Image from "next/image";
import AnimatedCounter from "./AnimatedCounter";

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      data-scroll-color-id="why"
      className="py-24 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Текстовый контент */}
          <div 
            className="flex-1 order-1 lg:order-1 w-full"
            data-reveal="slide-up"
            data-reveal-duration="800ms"
          >
            <h2 id="why-choose-us-heading" className="text-[24px] font-heading text-[#333] mb-6 font-bold">
              Почему выбирают Ири&Ка
            </h2>
            <p className="text-[16px] text-[#333] leading-[1.5] mb-8 font-sans">
              Выбирая Ири&Ка, вы выбираете не просто услугу, а заботу.
            </p>
            
            <ul className="text-[16px] text-[#333] leading-[1.5] mb-12 space-y-4 list-disc pl-5 marker:text-accent font-sans">
              <li data-reveal="slide-left" data-reveal-delay="100ms"><strong>Стерильно:</strong> Крафт-пакет вскрывается при вас.</li>
              <li data-reveal="slide-left" data-reveal-delay="200ms"><strong>Качественно:</strong> Работаем на результат — ресницы не мешают, а маникюр не отслаивается.</li>
              <li data-reveal="slide-left" data-reveal-delay="300ms"><strong>Уютно:</strong> Приятный интерьер в теплых тонах, чай/кофе и внимание к деталям.</li>
              <li data-reveal="slide-left" data-reveal-delay="400ms"><strong>Удобно:</strong> Запись на ресницы и ногти в один день для экономии вашего времени.</li>
            </ul>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 lg:gap-x-12 w-full" role="group" aria-label="Статистика студии">
              <div className="flex flex-col justify-start items-start w-full" tabIndex={0} data-reveal="scale" data-reveal-delay="200ms">
                <AnimatedCounter 
                  target={2019} 
                  start={2000} 
                  duration={2000} 
                  formatNumber={false} 
                  className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-none font-bold text-accent font-heading cursor-default transition-transform hover:scale-105" 
                />
                <span className="text-[0.875rem] md:text-[1rem] text-[#333] mt-2 font-sans opacity-80">год основания</span>
              </div>
              <div className="flex flex-col justify-start items-start w-full" tabIndex={0} data-reveal="scale" data-reveal-delay="400ms">
                <AnimatedCounter 
                  target={10000} 
                  start={0} 
                  duration={2500} 
                  suffix="+" 
                  className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-none font-bold text-accent font-heading cursor-default transition-transform hover:scale-105" 
                />
                <span className="text-[0.875rem] md:text-[1rem] text-[#333] mt-2 font-sans opacity-80">довольных клиентов</span>
              </div>
              <div className="flex flex-col justify-start items-start w-full col-span-2 md:col-span-1" tabIndex={0} data-reveal="scale" data-reveal-delay="600ms">
                <AnimatedCounter 
                  target={100} 
                  start={0} 
                  duration={2000} 
                  suffix=" %" 
                  className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-none font-bold text-accent font-heading cursor-default transition-transform hover:scale-105" 
                />
                <span className="text-[0.875rem] md:text-[1rem] text-[#333] mt-2 font-sans opacity-80">стерильно</span>
              </div>
            </div>
          </div>

          {/* Изображение */}
          <figure className="flex-1 order-2 lg:order-2 w-full m-0" data-reveal="scale" data-reveal-duration="1000ms" data-reveal-delay="300ms">
            <div className="relative w-full h-[320px] md:h-[440px]">
              <Image
                src="/img/studio.webp"
                alt="Уютный интерьер студии Ири&Ка с мастерами за работой"
                fill
                className="rounded-3xl shadow-xl object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </figure>
          
        </div>
      </div>
    </section>
  );
}
