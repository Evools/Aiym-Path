"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useToast } from "@/context/ToastContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail("admin@aiympath.kg");
    setPassword("admin");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success("Добро пожаловать в панель управления!", "Успешный вход");
        router.push("/admin");
      } else {
        setErrorMsg(res.error || "Не удалось выполнить вход");
        toast.error(res.error || "Неверные данные для входа", "Ошибка авторизации");
      }
    } catch {
      setErrorMsg("Произошла ошибка при входе. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F4] flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* Background Decorative Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#07626A]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#07626A]/15 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Back to main site link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D0D0D]/60 hover:text-[#07626A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться на сайт</span>
          </Link>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(7,98,106,0.10)] text-[#07626A] text-[11px] font-extrabold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aiym Path Security</span>
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E1E1E1] shadow-xl flex flex-col gap-6">
          {/* Logo & Header */}
          <div className="text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(7,98,106,0.08)] border border-[rgba(7,98,106,0.18)] flex items-center justify-center mb-4 text-[#07626A] shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>

            <h1
              className="text-2xl font-extrabold text-[#0D0D0D] tracking-tight"
              style={{
                fontFamily: "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
              }}
            >
              Вход в админ-панель
            </h1>
            <p className="text-xs text-[#0D0D0D]/60 mt-1.5 max-w-xs">
              Управление маршрутами, женскими гидами и безопасными локациями Aiym Path.
            </p>
          </div>

          {/* Demo Autofill Banner */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full p-3 rounded-2xl bg-[#FAFBFB] border border-dashed border-[#07626A]/40 hover:border-[#07626A] hover:bg-[rgba(7,98,106,0.04)] text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#07626A] block">
                  Заполнить демо-доступ
                </span>
                <span className="text-[10px] text-[#0D0D0D]/50">
                  Логин: admin@aiympath.kg • Пароль: admin
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#07626A] group-hover:underline">
              Вставить
            </span>
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                Электронная почта
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#0D0D0D]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aiympath.kg"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs sm:text-sm font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                Пароль администратора
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#0D0D0D]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-11 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs sm:text-sm font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0D0D0D]/40 hover:text-[#0D0D0D] transition-colors cursor-pointer"
                  title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full h-12 mt-2 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Войти в систему</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-[#0D0D0D]/50 mt-6">
          Aiym Path Female-Friendly Travel Platform • Protected Admin Gateway
        </p>
      </div>
    </div>
  );
}
