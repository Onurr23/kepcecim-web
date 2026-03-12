"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TriggerType } from "./AppRedirectOverlay";
import { useAppModal } from "@/contexts/AppModalContext";

type AppGuardTrigger = "call" | "message" | "gallery";

interface AppGuardProps {
    children: React.ReactNode;
    trigger: AppGuardTrigger;
    productImage?: string;
    className?: string;
}

function getOverlayTriggerType(t: AppGuardTrigger): TriggerType {
    switch (t) {
        case "call":
        case "message":
            return "contact";
        case "gallery":
        default:
            return "general";
    }
}

export default function AppGuard({ children, trigger, className }: AppGuardProps) {
    const { openModal } = useAppModal();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(getOverlayTriggerType(trigger));
    };

    return (
        <div onClickCapture={handleClick} className={cn("cursor-pointer", className)} role="button" tabIndex={0}>
            {children}
        </div>
    );
}
