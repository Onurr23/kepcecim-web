"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AppRedirectOverlay, { TriggerType } from "./AppRedirectOverlay";

type AppGuardTrigger = "call" | "message" | "favorite" | "gallery";

interface AppGuardProps {
    children: React.ReactNode;
    trigger: AppGuardTrigger;
    productImage?: string; // Kept for API compatibility, though might not be used in new overlay
    className?: string;
}

export default function AppGuard({ children, trigger, className }: AppGuardProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Map legacy/guard triggers to new overlay triggers
    const getOverlayTriggerType = (t: AppGuardTrigger): TriggerType => {
        switch (t) {
            case 'call':
            case 'message':
                return 'contact';
            case 'favorite':
                return 'favorite';
            case 'gallery':
                return 'general'; // Or 'general' if gallery specific logic isn't defined yet
            default:
                return 'general';
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
    };

    return (
        <>
            <div onClickCapture={handleClick} className={cn("cursor-pointer", className)} role="button" tabIndex={0}>
                {children}
            </div>

            <AppRedirectOverlay
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                triggerType={getOverlayTriggerType(trigger)}
            />
        </>
    );
}
