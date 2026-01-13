"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ContactModal } from "@/components/contact-modal";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 cursor-pointer relative z-50">
                    {/* Logo placeholder - replace with Image when available */}
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-light-text font-bold text-xs">
                        IY
                    </div>
                    <span className="font-bold text-primary text-xl hidden sm:block">
                        Instituto Yary
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
                    <Link href="/sobre" className="hover:text-primary transition-colors">
                        Quem Somos
                    </Link>
                    <Link href="/projetos" className="hover:text-primary transition-colors">
                        Projetos
                    </Link>
                    <Link href="/saberes" className="hover:text-primary transition-colors">
                        Saberes
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        Fazer Doação
                    </Button>
                    <Button size="sm" onClick={() => setIsContactOpen(true)}>
                        Contato
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </div>
            </div>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                        className="fixed inset-0 z-[200] bg-background h-[100dvh] md:hidden flex flex-col"
                    >
                        <div className="container mx-auto px-4 h-16 flex items-center justify-between border-b border-primary/10">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-light-text font-bold text-xs">
                                    IY
                                </div>
                                <span className="font-bold text-primary text-xl">
                                    Instituto Yary
                                </span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Fechar Menu</span>
                            </Button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
                            <nav className="flex flex-col items-center gap-6 text-lg font-medium">
                                <Link
                                    href="/"
                                    className="hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Início
                                </Link>
                                <Link
                                    href="/sobre"
                                    className="hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Quem Somos
                                </Link>
                                <Link
                                    href="/projetos"
                                    className="hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Projetos
                                </Link>
                                <Link
                                    href="/saberes"
                                    className="hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Saberes
                                </Link>
                            </nav>

                            <div className="flex flex-col gap-4 w-full max-w-xs">
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsContactOpen(true); // Open modal after closing menu
                                    }}
                                >
                                    Contato
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Fazer Doação
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
