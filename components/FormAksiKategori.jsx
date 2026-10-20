"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";

export default function FormAksiKategori({ action, children, className = "", ...hiddenFields }) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className={className}>
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {state?.error && <span className="text-xs text-bahaya">{state.error}</span>}
      {state?.sukses && <span className="text-xs text-utama">{state.sukses}</span>}
      {typeof children === "function" ? children({ isPending, state }) : children}
    </form>
  );
}
