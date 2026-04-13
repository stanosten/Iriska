"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function openPriceModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-price-modal"));
  }
}

export default function PriceModal() {
  const ANIMATION_MS = 450;
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [errors, setErrors] = useState({ name: "", phone: "" });

  // Управление монтированием и анимацией (появление/скрытие)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let rafId = 0;

    if (isOpen) {
      setIsMounted(true);
      // Переключаем видимость в следующем кадре, чтобы transition отработал корректно.
      rafId = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => setIsMounted(false), ANIMATION_MS);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isOpen, ANIMATION_MS]);

  // Слушаем кастомное событие
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setSubmitStatus("idle");
      setName("");
      setPhone("");
      setErrors({ name: "", phone: "" });
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("open-price-modal", handleOpen);
    return () => window.removeEventListener("open-price-modal", handleOpen);
  }, []);

  const closeModal = useCallback(() => {
    if (isSubmitting) return;

    setIsOpen(false);
    document.body.style.overflow = "";
  }, [isSubmitting]);

  // Закрытие по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.startsWith("7") || val.startsWith("8")) {
      val = val.slice(1);
    }
    let formatted = "";
    if (val.length > 0) {
      formatted = "+7 (" + val.substring(0, 3);
    }
    if (val.length >= 4) {
      formatted += ") " + val.substring(3, 6);
    }
    if (val.length >= 7) {
      formatted += "-" + val.substring(6, 8);
    }
    if (val.length >= 9) {
      formatted += "-" + val.substring(8, 10);
    }
    setPhone(formatted);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Разрешаем вводить только буквы (русские, английские) и пробелы/дефисы
    const val = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, "");
    setName(val);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", phone: "" };

    const nameTrimmed = name.trim();
    if (!nameTrimmed) {
      newErrors.name = "Пожалуйста, введите ваше имя";
      isValid = false;
    } else if (nameTrimmed.length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
      isValid = false;
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(nameTrimmed)) {
      newErrors.name = "Имя должно содержать только буквы";
      isValid = false;
    }

    if (!phone) {
      newErrors.phone = "Пожалуйста, введите номер телефона";
      isValid = false;
    } else if (phone.length < 18) { // +7 (XXX) XXX-XX-XX = 18 символов
      newErrors.phone = "Введите номер телефона полностью";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return; // Защита от повторной отправки

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Имитация AJAX-запроса с сохранением в БД или отправкой на email
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Здесь мог бы быть реальный fetch-запрос к API
      // например: await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ name, phone }) })
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
      {/* Overlay с fade-in анимацией */}
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer transition-opacity duration-[450ms] ease-out motion-reduce:transition-none ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Body с комбинацией fade-in и translateY/scale */}
      <div 
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-accent/10 p-8 md:p-10 overflow-hidden transform-gpu will-change-transform will-change-opacity transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
        role="dialog"
        aria-modal="true"
      >
        <button 
          type="button"
          onClick={closeModal}
          disabled={isSubmitting}
          className="absolute top-6 right-6 p-2 rounded-full text-foreground/50 disabled:opacity-50"
          aria-label="Закрыть окно"
        >
          <X className="w-6 h-6" />
        </button>

        {submitStatus === "success" ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-3xl mb-4">Спасибо!</h3>
            <p className="opacity-80 mb-8">
              Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время для уточнения стоимости.
            </p>
            <button 
              type="button"
              onClick={closeModal}
              className="w-full bg-foreground text-background py-4 rounded-xl font-medium"
            >
              Отлично
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-heading text-3xl mb-2 pr-8">Узнать стоимость</h3>
            <p className="text-sm opacity-70 mb-8">Оставьте свои данные, и мы перезвоним вам, чтобы рассказать о ценах.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="price-name" className="block text-sm font-medium mb-2 opacity-80">Ваше имя</label>
                <input
                  id="price-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  disabled={isSubmitting}
                  placeholder="Ирина"
                  className={`w-full px-5 py-4 bg-background/50 border rounded-xl outline-none focus:ring-2 focus:ring-accent/50 ${errors.name ? "border-red-400 focus:border-red-400" : "border-accent/20 focus:border-accent"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="price-phone" className="block text-sm font-medium mb-2 opacity-80">Номер телефона</label>
                <input
                  id="price-phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                  placeholder="+7 (999) 000-00-00"
                  className={`w-full px-5 py-4 bg-background/50 border rounded-xl outline-none focus:ring-2 focus:ring-accent/50 ${errors.phone ? "border-red-400 focus:border-red-400" : "border-accent/20 focus:border-accent"}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-2">{errors.phone}</p>}
              </div>

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>Произошла ошибка при отправке. Пожалуйста, попробуйте позже.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative flex items-center justify-center bg-foreground text-background py-4 rounded-xl font-medium disabled:opacity-70 overflow-hidden"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6" />
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    Узнать стоимость
                  </span>
                )}
              </button>
              <p className="text-center text-[10px] opacity-50 mt-4 leading-tight">
                Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
