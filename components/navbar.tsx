"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-primary"
                    >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                    </svg>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    UniConvert
                </span>
            </Link>
            <div className="flex items-center gap-4">
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </Button>
                )}
                <Link href="https://github.com/Jatin-Sharma-11/UniConvert" target="_blank">
                    <Button variant="ghost" size="icon">
                        <Github className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
