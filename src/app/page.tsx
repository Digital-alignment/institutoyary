'use client';

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/Hero";
import { ProjectsCarousel } from "@/components/home/ProjectsCarousel";
import { Manifesto } from "@/components/home/Manifesto";
import { FeaturedBlogs } from "@/components/home/FeaturedBlogs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { settings, loading } = useSiteSettings();
  const { home_layout } = settings;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#941c1d]" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex flex-col pt-0">
        {/* 1. Hero Section */}
        {home_layout.show_hero && (
          <Hero
            title={home_layout.hero_title}
            subtitle={home_layout.hero_subtitle}
            text={home_layout.hero_text}
            slides={home_layout.hero_slides}
            button1={home_layout.hero_button_1}
            button2={home_layout.hero_button_2}
          />
        )}

        {/* 2. Introduction: Missão e Bem Viver */}
        {home_layout.show_mission && (
          <section className="container mx-auto px-4 md:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <span className="inline-block rounded-full bg-[#faefe0] px-4 py-1.5 text-sm font-bold tracking-wider text-[#941c1d] uppercase">
                Desde 2009
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                {home_layout.mission_title || "Uma OSCIP dedicada à regeneração socioambiental e ao fortalecimento cultural"}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-justify md:text-center whitespace-pre-line">
                {home_layout.mission_text || settings.site_description || "O Instituto Yary é uma associação sem fins lucrativos (OSCIP) que atua há mais de 15 anos em conjunto com populações tradicionais e na área socioambiental."}
              </p>

              {home_layout.mission_button?.text && (
                <div className="pt-4">
                  <Link href={home_layout.mission_button.url || '/sobre'}>
                    <Button variant="outline" size="lg" className="rounded-full border-gray-300 px-8 text-gray-700 hover:bg-gray-50 hover:text-black">
                      {home_layout.mission_button.text}
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </section>
        )}

        {/* 3. New Section: Quote / Nossa Missão */}
        {home_layout.show_quote && (
          <section className="bg-[#941c1d] py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-repeat" /> {/* Optional Pattern */}
            <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {home_layout.quote_title && (
                  <h3 className="text-white/80 uppercase tracking-widest font-bold mb-6 text-sm md:text-base">
                    {home_layout.quote_title}
                  </h3>
                )}
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif text-white leading-relaxed italic max-w-5xl mx-auto">
                  "{home_layout.quote_text || "Acreditamos que a terra não nos pertence, nós pertencemos à terra."}"
                </blockquote>
              </motion.div>
            </div>
          </section>
        )}

        {/* 4. Carrossel de Projetos (Featured) */}
        <section className="bg-gray-50 border-y border-gray-100">
          <ProjectsCarousel />
          <div className="container mx-auto px-4 md:px-8 pb-12 text-center">
            <Link href="/projetos">
              <Button size="lg" className="rounded-full bg-[#941c1d] px-8 py-6 text-lg font-bold hover:bg-[#7a1617] shadow-lg shadow-[#941c1d]/20 transition-all hover:scale-105">
                Explorar Todos os Projetos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* 5. Blogs (Saberes) */}
        {home_layout.show_blog && (
          <FeaturedBlogs blogIds={home_layout.featured_blogs} />
        )}

        {/* 6. Manifesto (Values) - Keeping as optional or bottom section */}
        {/* If user didn't ask to remove it, we keep it as 'extra' or remove if conflicts. User said 'Next section blog saberes', implying end. But Manifesto is good content. I'll leave it at the end. */}
        <Manifesto />

      </main>

      <Footer />
    </div>
  );
}
