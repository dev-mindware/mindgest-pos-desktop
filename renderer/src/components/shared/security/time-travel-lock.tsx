"use client";

import { useEffect, useState } from "react";
import { useSecurityStore } from "@/stores";
import { Clock, ShieldAlert, CheckCircle, RefreshCcw } from "lucide-react";

export function TimeTravelLock() {
  const { isTimeTravelLocked, tamperingReason, lockApp, unlockApp } = useSecurityStore();
  const [isChecking, setIsChecking] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    // Listen for the IPC broadcast
    if (typeof window !== "undefined" && (window as any).ipc) {
      const handleTamperDetected = (_: any, reason: string) => {
        // the electron ipc structure provides event as first arg, and data as second if using on.
        // If our preload exposes `on(channel, callback)`, it might pass directly.
        lockApp(reason || "Adulteração do relógio do sistema detectada.");
      };

      if (typeof (window as any).ipc.on === 'function') {
        (window as any).ipc.on("security:tamper-detected", handleTamperDetected);
      }
      
      // Cleanup Se houver .off
      return () => {
        if (typeof (window as any).ipc.off === 'function') {
          (window as any).ipc.off("security:tamper-detected", handleTamperDetected);
        }
      };
    }
  }, [lockApp]);

  const handleVerify = async () => {
    if (typeof window === "undefined" || !(window as any).ipc) return;
    
    setIsChecking(true);
    setErrorToast(null);

    try {
      const result = await (window as any).ipc.security.checkClock();
      if (result.valid) {
        unlockApp();
      } else {
        setErrorToast(result.reason || "O relógio continua incorreto ou adulterado.");
      }
    } catch (e: any) {
      setErrorToast(e.message || "Erro ao verificar o relógio.");
    } finally {
      setIsChecking(false);
    }
  };

  if (!isTimeTravelLocked) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl text-white p-6">
      <div className="max-w-md w-full bg-[#121214] border border-[#202024] rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-500/5">
            <Clock className="w-10 h-10 text-red-500 drop-shadow-md" />
            <div className="absolute top-0 right-0 w-6 h-6 bg-[#121214] rounded-full flex items-center justify-center translate-x-2 -translate-y-1">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2 tracking-tight text-zinc-100">Relógio Adulterado</h1>
          
          <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
            {typeof tamperingReason === 'string' ? tamperingReason : "Detetámos uma inconsistência no relógio do seu sistema. Como medida de segurança fiscal anti-fraude, o POS foi trancado."}
          </p>

          <div className="w-full bg-zinc-900/50 rounded-xl p-5 mb-8 border border-zinc-800/50 text-left">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-zinc-200">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Ação Obrigatória
            </h3>
            <ol className="text-xs text-zinc-400 space-y-3 list-decimal pl-4">
              <li>Abra as definições de Data/Hora do computador.</li>
              <li>Ajuste para a <strong>hora real e atual</strong>.</li>
              <li>Não use dados no passado para forçar operações.</li>
            </ol>
          </div>

          {errorToast && (
            <div className="w-full mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg animate-in fade-in slide-in-from-top-1">
              {errorToast}
            </div>
          )}

          <button 
            onClick={handleVerify} 
            disabled={isChecking}
            className="w-full h-12 cursor-pointer flex items-center justify-center text-sm font-bold bg-zinc-100 text-zinc-900 hover:bg-white active:scale-[0.98] transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isChecking ? 'A verificar integridade...' : 'Já acertei o relógio - Verificar'}
          </button>

          <p className="mt-8 text-[10px] text-zinc-600 font-bold tracking-[0.2em]">
            MINDGEST SECURITY ENGINE
          </p>
        </div>
      </div>
    </div>
  );
}
