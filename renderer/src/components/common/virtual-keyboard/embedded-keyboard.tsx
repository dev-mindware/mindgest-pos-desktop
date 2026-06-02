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
    const {
        layout,
        isShift,
        isCaps,
        toggleCaps,
        handleKeyPress,
        setLayout,
    } = useKeyboard();

    const containerRef = useRef<HTMLDivElement>(null);
    const keyboardRef = useRef<Keyboard | null>(null);

    // Initialize simple-keyboard
    useEffect(() => {
        if (!containerRef.current) return;

        keyboardRef.current = new Keyboard(containerRef.current, {
            onChange: () => {},
            layoutName: layout,
            onKeyPress: (button: string) => {
                let key = button;
                if (button === "{bksp}" || button === "{backspace}") key = "{bksp}";
                if (button === "{enter}") key = "{enter}";
                if (button === "{space}") key = "{space}";
                if (button === "{lock}" || button === "{caps}") {
                    toggleCaps();
                    return;
                }
                if (button === "{accent}") {
                    setLayout("accent");
                    return;
                }
                if (button === "{abc}") {
                    setLayout("default");
                    return;
                }
                handleKeyPress(key);
            },
            layout: {
                default: [
                    "1 2 3 4 5 6 7 8 9 0",
                    "q w e r t y u i o p",
                    "{lock} a s d f g h j k l",
                    "z x c v b n m , . {bksp}",
                    "{accent} {space} {enter}",
                ],
                shift: [
                    "1 2 3 4 5 6 7 8 9 0",
                    "Q W E R T Y U I O P",
                    "{lock} A S D F G H J K L",
                    "Z X C V B N M , . {bksp}",
                    "{accent} {space} {enter}",
                ],
                accent: [
                    "á à â ã é ê í ó ô õ ú ç",
                    "{abc} {space} {enter}",
                ],
                accentShift: [
                    "Á À Â Ã É Ê Í Ó Ô Õ Ú Ç",
                    "{abc} {space} {enter}",
                ],
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
                "{lock}": "Caps",
                "{accent}": "Áàã...",
                "{abc}": "Abc",
            },
            buttonTheme: [
                { class: "hg-button-primary", buttons: "{enter}" },
                { class: "hg-button-special", buttons: "{bksp} {lock} 00 {accent} {abc}" },
            ],
        });

        return () => {
            keyboardRef.current?.destroy();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layout]);

    // Sync layout / caps
    useEffect(() => {
        if (!keyboardRef.current) return;

        let targetLayout: string = layout;
        const wantUpper = isCaps !== (isShift && layout !== "numeric");

        if (layout === "default" && wantUpper) targetLayout = "shift";
        else if (layout === "accent" && wantUpper) targetLayout = "accentShift";

        const themes = [
            { class: "hg-button-primary", buttons: "{enter}" },
            { class: "hg-button-special", buttons: "{bksp} {lock} 00 {accent} {abc}" },
        ];
        if (isCaps) themes.push({ class: "hg-button-active", buttons: "{lock}" });

        keyboardRef.current.setOptions({ layoutName: targetLayout, buttonTheme: themes });
    }, [layout, isShift, isCaps]);

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
