import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="bg-primary text-light-text">
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Column */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-light-text text-primary flex items-center justify-center font-bold">
                            IY
                        </div>
                        <span className="font-bold text-xl">Instituto Yary</span>
                    </div>
                    <p className="text-light-text/80 text-sm font-light">
                        Atuar no mundo hoje cooperando para regeneração e co-criando um futuro belo.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <Link href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Youtube className="h-5 w-5" /></Link>
                    </div>
                </div>

                {/* Links Column */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-lg">Institucional</h3>
                    <nav className="flex flex-col gap-2 text-sm text-light-text/80">
                        <Link href="/sobre" className="hover:text-white transition-colors">Nossa História</Link>
                        <Link href="/projetos" className="hover:text-white transition-colors">Projetos</Link>
                        <Link href="/blog" className="hover:text-white transition-colors">Blog / Saberes</Link>

                    </nav>
                </div>

                {/* Contact Column */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-lg">Contato</h3>
                    <div className="flex flex-col gap-3 text-sm text-light-text/80">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 shrink-0" />
                            <span>Itacaré - Bahia<br />Alto Xingu & Mata Atlântica</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0" />
                            <a href="mailto:contato@institutoyary.org" className="hover:underline">contato@institutoyary.org</a>
                        </div>
                    </div>
                </div>

                {/* Newsletter Column */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-lg">Fique por dentro</h3>
                    <p className="text-sm text-light-text/80">Receba novidades e ações em seu e-mail.</p>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Seu e-mail"
                            className="bg-light-text/10 border-light-text/20 text-light-text placeholder:text-light-text/50 focus-visible:ring-offset-primary"
                        />
                        <Button variant="secondary" size="sm">
                            <Mail className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

            </div>

            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-light-text/60">
                    <p>&copy; {new Date().getFullYear()} Instituto Yary. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white">Termos de Uso</Link>
                        <Link href="#" className="hover:text-white">Política de Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
