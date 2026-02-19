"use client";

import { TriggerType } from "@/components/ui/AppRedirectOverlay";
import { useAppModal } from "@/contexts/AppModalContext";

interface OpenAppModalTriggerProps {
  triggerType?: TriggerType;
  className?: string;
  children: React.ReactNode;
}

/** Renders children as a clickable element that opens the app download modal. */
export default function OpenAppModalTrigger({
  triggerType = "general",
  className = "",
  children,
}: OpenAppModalTriggerProps) {
  const { openModal } = useAppModal();

  return (
    <button
      type="button"
      onClick={() => openModal(triggerType)}
      className={className}
    >
      {children}
    </button>
  );
}
