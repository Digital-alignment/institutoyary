"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Youtube, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [email, setEmail] = useState("");
    const [mounted, setMounted] = useState(false);
    const { settings } = useSiteSettings();
    const social = settings.social_links;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription logic
        console.log("Subscribing email:", email);
        setEmail("");
        // Optional: Show success message
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101]"
                    >
                        <div className="bg-background rounded-xl shadow-2xl overflow-hidden border border-white/10 relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-foreground/50 hover:text-foreground transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                                <span className="sr-only">Close</span>
                            </button>

                            {/* Content */}
                            <div className="p-8 flex flex-col items-center text-center space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-primary">Fale Conosco</h2>
                                    <p className="text-sm text-foreground/70">
                                        Estamos aqui para ouvir você. Entre em contato ou siga-nos nas redes sociais.
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4">
                                    <a
                                        href={`mailto:${social.email || 'contato@institutoyary.org'}`}
                                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                                        title="Email"
                                    >
                                        <Mail className="w-6 h-6" />
                                    </a>
                                    
                                    {social.instagram && (
                                        <a
                                            href={social.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                                            title="Instagram"
                                        >
                                            <Instagram className="w-6 h-6" />
                                        </a>
                                    )}

                                    {social.youtube && (
                                        <a
                                            href={social.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                                            title="YouTube"
                                        >
                                            <Youtube className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-border/50" />

                                {/* Newsletter */}
                                <div className="w-full space-y-3">
                                    <h3 className="text-sm font-semibold">Assine nossa Newsletter</h3>
                                    <form onSubmit={handleSubmit} className="flex gap-2">
                                        <Input
                                            type="email"
                                            placeholder="Seu e-mail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-secondary/50"
                                        />
                                        <Button type="submit" size="sm">
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
