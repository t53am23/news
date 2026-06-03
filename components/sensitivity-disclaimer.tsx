import { AlertTriangle } from "lucide-react";
import type { SignalBrief, SensitivityLevel } from "@/lib/types";

const labelMap: Record<SensitivityLevel, string> = {
  normal: "Information",
  legal: "Legal and policy",
  immigration: "Visa and immigration",
  health: "Health",
  finance: "Finance"
};

export function SensitivityDisclaimer({ brief, compact = false }: { brief?: SignalBrief; compact?: boolean }) {
  if (brief && !brief.disclaimerRequired) return null;

  const label = brief?.sensitivityLevel ? labelMap[brief.sensitivityLevel] : "Sensitive topic";

  return (
    <aside className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          {!compact && <p className="font-semibold">{label} disclaimer</p>}
          <p>
            This summary is for information only and is not legal, immigration, medical, or professional advice. Always
            verify from the official source.
          </p>
        </div>
      </div>
    </aside>
  );
}
