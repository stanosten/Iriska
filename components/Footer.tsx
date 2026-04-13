"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, LoaderCircle, MapPin, Phone, Instagram, Send } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { openModal } from "./Modal";

type Coordinates = [number, number];

interface YMapInstance {
  destroy: () => void;
  setCenter: (center: Coordinates, zoom?: number) => void;
  geoObjects: { add: (obj: YPlacemarkInstance) => void };
  container: { fitToViewport: () => void };
  behaviors: { enable: (name: string) => void };
}

interface YPlacemarkInstance {}

interface YMapsApi {
  ready: (callback: () => void) => void;
  Map: new (
    container: HTMLElement,
    state: { center: Coordinates; zoom: number; controls: string[] },
    options?: Record<string, unknown>
  ) => YMapInstance;
  Placemark: new (
    coordinates: Coordinates,
    properties: Record<string, unknown>,
    options: Record<string, unknown>
  ) => YPlacemarkInstance;
}

type WindowWithYmaps = Window & { ymaps?: YMapsApi };

const YMAPS_SCRIPT_ID = "yandex-maps-api";
const FALLBACK_COORDS: Coordinates = [55.7778, 37.5311];
const STUDIO_ADDRESS = "Москва, Хорошёвское шоссе, 82к1";
let ymapsLoaderPromise: Promise<YMapsApi> | null = null;

const loadYmapsApi = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is not available"));
  }

  const currentWindow = window as WindowWithYmaps;
  if (currentWindow.ymaps) {
    return Promise.resolve(currentWindow.ymaps);
  }

  if (ymapsLoaderPromise) {
    return ymapsLoaderPromise;
  }

  ymapsLoaderPromise = new Promise<YMapsApi>((resolve, reject) => {
    const resolveIfReady = () => {
      const ymapsApi = (window as WindowWithYmaps).ymaps;
      if (ymapsApi) {
        resolve(ymapsApi);
      } else {
        reject(new Error("ymaps is undefined after script load"));
      }
    };

    const existingScript = document.getElementById(YMAPS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", resolveIfReady, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Yandex Maps script load failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = YMAPS_SCRIPT_ID;
    script.type = "text/javascript";
    script.async = true;
    script.defer = true;
    script.charset = "utf-8";
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    script.addEventListener("load", resolveIfReady, { once: true });
    script.addEventListener("error", () => reject(new Error("Yandex Maps script load failed")), { once: true });
    document.head.appendChild(script);
  });

  return ymapsLoaderPromise;
};

export default function Footer() {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<YMapInstance | null>(null);
  const mapObserverRef = useRef<IntersectionObserver | null>(null);
  const [mapStatus, setMapStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const mapHost = mapHostRef.current;
    if (!mapHost) return;

    let isCancelled = false;

    const initMap = async () => {
      if (isCancelled || mapInstanceRef.current) return;
      setMapStatus("loading");

      try {
        const ymaps = await loadYmapsApi();
        if (isCancelled || mapInstanceRef.current || !mapHostRef.current) return;

        await new Promise<void>((resolve) => {
          ymaps.ready(() => resolve());
        });

        if (isCancelled || mapInstanceRef.current || !mapHostRef.current) return;

        const map = new ymaps.Map(
          mapHostRef.current,
          {
            center: FALLBACK_COORDS,
            zoom: 16,
            controls: ["zoomControl"],
          },
          {
            suppressMapOpenBlock: true,
          }
        );

        map.behaviors.enable("drag");
        map.behaviors.enable("scrollZoom");
        mapInstanceRef.current = map;

        map.container.fitToViewport();

        const placemark = new ymaps.Placemark(
          FALLBACK_COORDS,
          {
            balloonContent: STUDIO_ADDRESS,
            iconCaption: "Ири&Ка",
          },
          {
            preset: "islands#redBeautyIcon",
          }
        );

        map.geoObjects.add(placemark);
        map.setCenter(FALLBACK_COORDS, 17);
        setMapStatus("ready");
      } catch {
        if (!isCancelled) {
          setMapStatus("error");
        }
      }
    };

    const scheduleInit = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => {
          void initMap();
        }, { timeout: 700 });
      } else {
        void initMap();
      }
    };

    mapObserverRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          mapObserverRef.current?.disconnect();
          scheduleInit();
        }
      },
      { threshold: 0.2, rootMargin: "200px 0px" }
    );

    mapObserverRef.current.observe(mapHost);

    return () => {
      isCancelled = true;
      mapObserverRef.current?.disconnect();
      mapObserverRef.current = null;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <footer
      id="contacts"
      data-theme="dark"
      data-scroll-color-id="footer"
      className="bg-foreground text-white py-10 px-6 md:px-12 overflow-hidden min-h-screen flex flex-col"
    >
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full items-center py-12">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl mb-6">Студия Ири&Ка</h2>
              <p className="opacity-70 max-w-md text-lg">
                Мы всегда рады видеть вас. Запишитесь онлайн или свяжитесь с нами любым удобным способом.
              </p>
            </div>

            <div className="flex flex-col gap-6 opacity-90 mt-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-accent" />
                <p>Москва, Хорошёвское шоссе, 82 к1</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-accent" />
                <a href="tel:+79991234567">+7 (999) 123-45-67</a>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="mt-4">
              <MagneticButton type="button" onClick={openModal} className="bg-accent text-white px-8 py-4 rounded-full font-medium w-fit">
                Онлайн-запись
              </MagneticButton>
            </div>
          </div>

          <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 flex flex-col items-center justify-center border border-white/20">
              <div className="relative w-full h-full">
                <div
                  ref={mapHostRef}
                  role="region"
                  className="w-full h-full"
                  aria-label={`Карта: ${STUDIO_ADDRESS}`}
                />

                {mapStatus !== "ready" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 backdrop-blur-[1px]">
                    {mapStatus === "error" ? (
                      <div className="flex flex-col items-center gap-2 text-white/90 px-4 text-center">
                        <AlertTriangle className="w-7 h-7 text-accent" />
                        <p className="text-sm md:text-base font-medium">Не удалось загрузить карту</p>
                        <p className="text-xs md:text-sm opacity-80">Проверьте соединение и обновите страницу</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-white/90">
                        <LoaderCircle className="w-5 h-5" />
                        <span className="text-sm md:text-base">Загружаем карту...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl w-full mx-auto pt-8 border-t border-white/10 text-center opacity-50 text-sm mt-auto">
        © {new Date().getFullYear()} Студия красоты Ири&Ка. Все права защищены.
      </div>
    </footer>
  );
}
