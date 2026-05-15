"use client";

import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFontSize } from "./font-size-provider";

const CYCLES = ["normal", "large", "xlarge"] as const;
const LABELS = { normal: "A", large: "A+", xlarge: "A++" };

export function FontSizeToggle() {
  const { scale, setScale } = useFontSize();

  function cycle() {
    const idx = CYCLES.indexOf(scale);
    const next = CYCLES[(idx + 1) % CYCLES.length];
    setScale(next);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={cycle}
      className="min-h-11 gap-2"
      aria-label={`Tamanho da fonte: ${LABELS[scale]}. Clique para aumentar.`}
    >
      <Type className="size-5" aria-hidden />
      <span className="font-semibold">{LABELS[scale]}</span>
    </Button>
  );
}
