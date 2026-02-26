"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DynamicDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
}

export function DynamicDrawer({
    open,
    onOpenChange,
    title,
    description,
    children,
    className,
    side = "right",
}: DynamicDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={side} className={cn("w-full sm:max-w-xl", className)}>
                <SheetHeader>
                    {title && <SheetTitle>{title}</SheetTitle>}
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                <div className="mt-6 flex-1 overflow-y-auto p-4">{children}</div>
            </SheetContent>
        </Sheet>
    );
}
