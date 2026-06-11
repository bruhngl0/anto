"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ThemeOption {
  id: string;
  name: string;
  color: string;
}

interface PortfolioHeaderProps {
  initials: string;
  onOpenConfigurator: () => void;
  isConfiguratorOpen: boolean;
  activeThemeId: string;
  onThemeChange: (themeId: string) => void;
  themes: ThemeOption[];
}

export default function PortfolioHeader({
  initials,
  onOpenConfigurator,
  isConfiguratorOpen,
  activeThemeId,
  onThemeChange,
  themes,
}: PortfolioHeaderProps) {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Play audio when track changes
  useEffect(() => {
    if (activeTrack) {
      let src = "";
      if (activeTrack === "heaven") {
        src = "/75%20Heaven.mp3";
      } else if (activeTrack === "summer") {
        src = "/37%20Summer%20Of%20'69.mp3";
      } else if (activeTrack === "yumeji") {
        src = "/In%20The%20Mood%20For%20Love%20-%20Yumeji's%20Theme%20%5B4K%5D%20-%20clarencito%20(192k).mp3";
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = src;
      } else {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
      }
      audioRef.current.volume = 0.4; // Soft background level
      audioRef.current.play().catch((err) => {
        console.warn("Audio play blocked or deferred:", err);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [activeTrack]);

  return (
    <motion.header 
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="header__logo font-medium select-none" style={{ padding: 0, overflow: "hidden" }}>
        <img 
          src="/claudia.jpg" 
          alt="Logo" 
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
        />
      </div>
      
      <nav className="header__nav">
        {/* Theme Selector Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => {
              setIsThemeOpen(!isThemeOpen);
              setIsSoundOpen(false);
            }} 
            className="interactive"
            style={{
              fontSize: "1.2rem",
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "var(--mid)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            Theme <span style={{ fontSize: "0.8rem" }}>▼</span>
          </button>
          
          {isThemeOpen && (
            <div 
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                padding: "8px 0",
                minWidth: "140px",
                display: "flex",
                flexDirection: "column",
                zIndex: 200,
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
              }}
            >
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange(t.id);
                    setIsThemeOpen(false);
                  }}
                  className="interactive"
                  style={{
                    padding: "8px 16px",
                    fontSize: "1.1rem",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: activeThemeId === t.id ? "var(--fg)" : "var(--mid)",
                    background: activeThemeId === t.id ? "rgba(242, 242, 242, 0.05)" : "transparent"
                  }}
                >
                  <span 
                    style={{ 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      background: t.color,
                      border: "1px solid rgba(242, 242, 242, 0.2)"
                    }} 
                  />
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sound Selector Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => {
              setIsSoundOpen(!isSoundOpen);
              setIsThemeOpen(false);
            }} 
            className="interactive"
            style={{
              fontSize: "1.2rem",
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "var(--mid)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            Sound: {activeTrack ? (activeTrack === "heaven" ? "75 Heaven" : activeTrack === "summer" ? "Summer Of '69" : "Yumeji's Theme") : "Off"} <span style={{ fontSize: "0.8rem" }}>▼</span>
          </button>
          
          {isSoundOpen && (
            <div 
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                padding: "8px 0",
                minWidth: "160px",
                display: "flex",
                flexDirection: "column",
                zIndex: 200,
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
              }}
            >
              <button
                onClick={() => {
                  setActiveTrack(null);
                  setIsSoundOpen(false);
                }}
                className="interactive"
                style={{
                  padding: "8px 16px",
                  fontSize: "1.1rem",
                  textAlign: "left",
                  color: !activeTrack ? "var(--fg)" : "var(--mid)",
                  background: !activeTrack ? "rgba(242, 242, 242, 0.05)" : "transparent"
                }}
              >
                🔈 Sound Off
              </button>
              <button
                onClick={() => {
                  setActiveTrack("heaven");
                  setIsSoundOpen(false);
                }}
                className="interactive"
                style={{
                  padding: "8px 16px",
                  fontSize: "1.1rem",
                  textAlign: "left",
                  color: activeTrack === "heaven" ? "var(--fg)" : "var(--mid)",
                  background: activeTrack === "heaven" ? "rgba(242, 242, 242, 0.05)" : "transparent"
                }}
              >
                🎵 75 Heaven
              </button>
              <button
                onClick={() => {
                  setActiveTrack("summer");
                  setIsSoundOpen(false);
                }}
                className="interactive"
                style={{
                  padding: "8px 16px",
                  fontSize: "1.1rem",
                  textAlign: "left",
                  color: activeTrack === "summer" ? "var(--fg)" : "var(--mid)",
                  background: activeTrack === "summer" ? "rgba(242, 242, 242, 0.05)" : "transparent"
                }}
              >
                🎵 Summer Of '69
              </button>
              <button
                onClick={() => {
                  setActiveTrack("yumeji");
                  setIsSoundOpen(false);
                }}
                className="interactive"
                style={{
                  padding: "8px 16px",
                  fontSize: "1.1rem",
                  textAlign: "left",
                  color: activeTrack === "yumeji" ? "var(--fg)" : "var(--mid)",
                  background: activeTrack === "yumeji" ? "rgba(242, 242, 242, 0.05)" : "transparent"
                }}
              >
                🎵 Yumeji's Theme
              </button>
            </div>
          )}
        </div>

        <a 
          href="https://magicfabricblog.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="interactive"
        >
          Magic Fabric ↗
        </a>
        <a href="#about" className="interactive">Bio</a>
        <a href="#contact" className="interactive">Contact</a>
        <button 
          onClick={onOpenConfigurator} 
          className={`interactive font-bold header__customize-btn ${isConfiguratorOpen ? "active" : ""}`}
          style={{ 
            color: isConfiguratorOpen ? 'var(--fg)' : 'rgba(242, 242, 242, 0.65)',
            border: '1px solid rgba(242, 242, 242, 0.2)',
            padding: '4px 8px',
            fontSize: '1.05rem',
            letterSpacing: '0.08em',
            borderRadius: '2px',
            background: isConfiguratorOpen ? 'rgba(242,242,242,0.1)' : 'transparent'
          }}
        >
          [Customize Site]
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className="header__nav-mobile-container">
        <button 
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            setIsThemeOpen(false);
            setIsSoundOpen(false);
          }}
          className="interactive mobile-menu-toggle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            color: "var(--fg)",
          }}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14" />
              <line x1="14" y1="4" x2="4" y2="14" />
            </svg>
          ) : (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="2" x2="16" y2="2" />
              <line x1="2" y1="7" x2="16" y2="7" />
              <line x1="2" y1="12" x2="16" y2="12" />
            </svg>
          )}
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-menu-dropdown">
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-item"
            >
              Bio
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-item"
            >
              Contact
            </a>
            <a 
              href="https://magicfabricblog.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-item"
            >
              Magic Fabric ↗
            </a>
            
            {/* Theme section inside mobile menu */}
            <div className="mobile-menu-section">
              <button 
                onClick={() => {
                  setIsThemeOpen(!isThemeOpen);
                  setIsSoundOpen(false);
                }}
                className="mobile-menu-item"
                style={{ justifyContent: "space-between", width: "100%", display: "flex", alignItems: "center" }}
              >
                <span>Theme ({themes.find(t => t.id === activeThemeId)?.name || activeThemeId})</span>
                <span>{isThemeOpen ? "▲" : "▼"}</span>
              </button>
              {isThemeOpen && (
                <div className="mobile-submenu">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onThemeChange(t.id);
                        setIsThemeOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="mobile-submenu-item"
                      style={{
                        color: activeThemeId === t.id ? "var(--fg)" : "var(--mid)",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <span 
                        style={{ 
                          width: "8px", 
                          height: "8px", 
                          borderRadius: "50%", 
                          background: t.color,
                          marginRight: "8px",
                          display: "inline-block",
                          border: "1px solid rgba(242, 242, 242, 0.2)"
                        }} 
                      />
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sound section inside mobile menu */}
            <div className="mobile-menu-section">
              <button 
                onClick={() => {
                  setIsSoundOpen(!isSoundOpen);
                  setIsThemeOpen(false);
                }}
                className="mobile-menu-item"
                style={{ justifyContent: "space-between", width: "100%", display: "flex", alignItems: "center" }}
              >
                <span>Sound ({activeTrack ? (activeTrack === "heaven" ? "75 Heaven" : activeTrack === "summer" ? "Summer of '69" : "Yumeji's Theme") : "Off"})</span>
                <span>{isSoundOpen ? "▲" : "▼"}</span>
              </button>
              {isSoundOpen && (
                <div className="mobile-submenu">
                  <button
                    onClick={() => {
                      setActiveTrack(null);
                      setIsSoundOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-submenu-item"
                    style={{ color: !activeTrack ? "var(--fg)" : "var(--mid)" }}
                  >
                    🔈 Sound Off
                  </button>
                  <button
                    onClick={() => {
                      setActiveTrack("heaven");
                      setIsSoundOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-submenu-item"
                    style={{ color: activeTrack === "heaven" ? "var(--fg)" : "var(--mid)" }}
                  >
                    🎵 75 Heaven
                  </button>
                  <button
                    onClick={() => {
                      setActiveTrack("summer");
                      setIsSoundOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-submenu-item"
                    style={{ color: activeTrack === "summer" ? "var(--fg)" : "var(--mid)" }}
                  >
                    🎵 Summer Of '69
                  </button>
                  <button
                    onClick={() => {
                      setActiveTrack("yumeji");
                      setIsSoundOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-submenu-item"
                    style={{ color: activeTrack === "yumeji" ? "var(--fg)" : "var(--mid)" }}
                  >
                    🎵 Yumeji's Theme
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
