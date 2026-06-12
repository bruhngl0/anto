"use client";

import { useState, useEffect, useCallback } from "react";
import { PortfolioConfig } from "../data/defaultConfig";
import CustomCursor from "../components/CustomCursor";
import PortfolioHeader from "../components/PortfolioHeader";
import InfoGrid from "../components/InfoGrid";
import PortfolioGrid from "../components/PortfolioGrid";
import Configurator from "../components/Configurator";
import Loading from "../app/loading";
import { motion } from "framer-motion";
import LinkArrow from "./LinkArrow";

interface Theme {
  id: string;
  name: string;
  bg: string;
  fg: string;
  line: string;
  mid: string;
  color: string;
}

const THEMES: Theme[] = [
  {
    id: "charcoal",
    name: "Charcoal",
    bg: "#2b2b2b",
    fg: "#f2f2f2",
    line: "rgba(242, 242, 242, 0.12)",
    mid: "rgba(242, 242, 242, 0.45)",
    color: "#2b2b2b",
  },
  {
    id: "babypink",
    name: "Baby Pink",
    bg: "#fff0f5",
    fg: "#2b2b2b",
    line: "rgba(43, 43, 43, 0.12)",
    mid: "rgba(43, 43, 43, 0.55)",
    color: "#fff0f5",
  },
  {
    id: "slategrey",
    name: "Slate Grey",
    bg: "#4a5568",
    fg: "#f2f2f2",
    line: "rgba(242, 242, 242, 0.16)",
    mid: "rgba(242, 242, 242, 0.55)",
    color: "#4a5568",
  },
  {
    id: "deepplum",
    name: "Deep Plum",
    bg: "#3b1f2b",
    fg: "#f2f2f2",
    line: "rgba(242, 242, 242, 0.12)",
    mid: "rgba(242, 242, 242, 0.5)",
    color: "#3b1f2b",
  },
  {
    id: "forestmoss",
    name: "Forest Moss",
    bg: "#2d3a2e",
    fg: "#f2f2f2",
    line: "rgba(242, 242, 242, 0.12)",
    mid: "rgba(242, 242, 242, 0.5)",
    color: "#2d3a2e",
  },
  {
    id: "lighttheme",
    name: "Light Theme",
    bg: "#f2f2f2",
    fg: "#2b2b2b",
    line: "rgba(43, 43, 43, 0.12)",
    mid: "rgba(43, 43, 43, 0.55)",
    color: "#f2f2f2",
  },
  {
    id: "royalblue",
    name: "Royal Blue",
    bg: "#0a369b",
    fg: "#f2f2f2",
    line: "rgba(242, 242, 242, 0.16)",
    mid: "rgba(242, 242, 242, 0.55)",
    color: "#0a369b",
  },
];

interface PortfolioAppProps {
  initialConfig: PortfolioConfig;
}

export default function PortfolioApp({ initialConfig }: PortfolioAppProps) {
  const [config, setConfig] = useState<PortfolioConfig>(initialConfig);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);

  // Sync state if initialConfig updates from server
  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  // Load saved theme on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme) {
      const match = THEMES.find((t) => t.id === savedTheme);
      if (match) setActiveTheme(match);
    }
  }, []);

  // Update root styling when active theme changes
  useEffect(() => {
    document.documentElement.style.setProperty("--bg", activeTheme.bg);
    document.documentElement.style.setProperty("--fg", activeTheme.fg);
    document.documentElement.style.setProperty("--line", activeTheme.line);
    document.documentElement.style.setProperty("--mid", activeTheme.mid);
    localStorage.setItem("portfolio-theme", activeTheme.id);
  }, [activeTheme]);

  // Security checks: prevent keyboard shortcuts and selection copy/cut
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".configurator") || target.closest(".configurator-overlay")) {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".configurator") || target.closest(".configurator-overlay")) {
        return;
      }

      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleThemeChange = (themeId: string) => {
    const match = THEMES.find((t) => t.id === themeId);
    if (match) setActiveTheme(match);
  };

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading onComplete={handleComplete} />;
  }

  return (
    <>
      {/* Premium custom mouse follow cursor */}
      <CustomCursor />

      {/* Header containing logo, nav links and customize button */}
      <PortfolioHeader
        initials={config.initials}
        email={config.email}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        isConfiguratorOpen={isConfiguratorOpen}
        activeThemeId={activeTheme.id}
        onThemeChange={handleThemeChange}
        themes={THEMES}
      />

      <main className="page">
        {/* Name Banner Section */}
        <motion.section
          className="name-banner"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05
              }
            }
          }}
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
            }}
          >
            {config.artistName}
          </motion.h1>
          <motion.a
            href={`mailto:${config.email}`}
            className="name-banner__cta interactive"
            id="contact"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
            }}
          >
            {config.email}
          </motion.a>
        </motion.section>

        {/* Info Grid (About, Press, Speaking, Podcasts, Links) */}
        <InfoGrid config={config} />

        {/* Gallery grid mapping 10-columns of cards */}
        <PortfolioGrid gridItems={config.gridItems} />

        {/* Minimalist Grid-aligned Footer */}
        <motion.footer
          className="footer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* PC Desktop Version */}
          <div className="footer__pc">
            <div>© {new Date().getFullYear()} {config.artistName}</div>
            <div style={{ display: "flex", gap: "2.4rem" }}>
              <a
                href={`mailto:${config.email}`}
                className="interactive"
              >
                Email
              </a>
              <a
                href="https://magicfabricblog.com"
                target="_blank"
                rel="noopener noreferrer"
                className="interactive"
              >
                Blog
              </a>
            </div>
            <div>All Rights Reserved</div>
          </div>

          {/* Mobile Responsive Version */}
          <div className="footer__mobile">
            <div className="footer__copyright">© {new Date().getFullYear()} {config.artistName}</div>
            <a
              href={`mailto:${config.email}`}
              className="footer__contact interactive"
            >
              Get in touch → {config.email}
            </a>
          </div>
        </motion.footer>
      </main>

      {/* Customizable Configuration drawer */}
      <Configurator
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        config={config}
        onChange={setConfig}
      />
    </>
  );
}
