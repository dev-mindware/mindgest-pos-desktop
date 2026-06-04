"use client";

import React, { useRef, useEffect } from "react";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import { useKeyboard } from "@/contexts/keyboard-context";

/**
 * Inline (embedded) version of the virtual keyboard.
 * Unlike VirtualKeyboard (portal + fixed), this renders inside its parent container.
 * It is always visible — visibility should be controlled by the parent.
 */
export function EmbeddedKeyboard() {
    const { handleKeyPress } = useKeyboard();

    const containerRef = useRef<HTMLDivElement>(null);
    const keyboardRef = useRef<Keyboard | null>(null);

    // Initialize simple-keyboard as numeric-only
    useEffect(() => {
        if (!containerRef.current) return;

        keyboardRef.current = new Keyboard(containerRef.current, {
            onChange: () => {},
            layoutName: "numeric",
            onKeyPress: (button: string) => {
                let key = button;
                if (button === "{bksp}" || button === "{backspace}") key = "{bksp}";
                if (button === "{enter}") key = "{enter}";
                if (button === "{space}") key = "{space}";
                handleKeyPress(key);
            },
            layout: {
                numeric: [
                    "1 2 3",
                    "4 5 6",
                    "7 8 9",
                    "00 0 {bksp}",
                    "{enter}",
                ],
            },
            display: {
                "{bksp}": "⌫",
                "{enter}": "Enter ↵",
                "{space}": "Espaço",
            },
            buttonTheme: [
                { class: "hg-button-primary", buttons: "{enter}" },
                { class: "hg-button-special", buttons: "{bksp} 00" },
            ],
        });

        return () => {
            keyboardRef.current?.destroy();
        };
    }, [handleKeyPress]);

    return (
        <div className="w-full h-full flex flex-col justify-center p-3 overflow-hidden">
            <div
                id="virtual-keyboard"
                ref={containerRef}
                className="simple-keyboard-theme w-full"
            />
        </div>
    );
}
 