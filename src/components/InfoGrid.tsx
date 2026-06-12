"use client";

import { PortfolioConfig } from "../data/defaultConfig";
import { motion } from "framer-motion";

interface InfoGridProps {
  config: PortfolioConfig;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

function LinkArrow() {
  return (
    <svg
      viewBox="0 0 10 10"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: "0.82em",
        height: "0.82em",
        marginLeft: "0.22rem",
        position: "relative",
        top: "-0.05em",
      }}
    >
      <line x1="2" y1="8" x2="8" y2="2" />
      <polyline points="3.5 2 8 2 8 6.5" />
    </svg>
  );
}

export default function InfoGrid({ config }: InfoGridProps) {
  const { bio, films, music, fashion, blogs } = config;

  return (
    <motion.section
      className="intro-section"
      id="about"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ABOUT COLUMN (2fr) */}
      <motion.div className="intro-cell intro-cell--about" variants={columnVariants}>
        <span className="cell-label">About</span>
        <div className="intro-body">
          <p>
            {bio} <LinkArrow />
          </p>
        </div>
      </motion.div>

      {/* FILMS COLUMN (1.4fr) */}
      <motion.div className="intro-cell" variants={columnVariants}>
        <span className="cell-label">Films</span>
        <div className="ps-list ps-list--two-col">
          {films.map((item) => (
            <div key={item.id} className="ps-row">
              <span className="ps-num">{item.num}</span>
              <span className="ps-name">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="interactive">
                    {item.name} <LinkArrow />
                  </a>
                ) : (
                  <span className="ps-name--print">{item.name}</span>
                )}
              </span>
            </div>
          ))}
          {films.length % 2 !== 0 && <div className="ps-row" />}
        </div>
      </motion.div>

      {/* MUSIC COLUMN (1fr) */}
      <motion.div className="intro-cell" variants={columnVariants}>
        <span className="cell-label">Music</span>
        <div className="ps-list">
          {music.map((item) => (
            <div key={item.id} className="ps-row">
              <span className="ps-num">{item.num}</span>
              <span className="ps-name">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="interactive">
                    {item.name} <LinkArrow />
                  </a>
                ) : (
                  <span>{item.name}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FASHION COLUMN (0.8fr) */}
      <motion.div className="intro-cell intro-cell--fashion" variants={columnVariants}>
        <span className="cell-label">Fashion</span>
        <div className="ps-list">
          {fashion.map((item) => (
            <div key={item.id} className="ps-row">
              <span className="ps-num">{item.num}</span>
              <span className="ps-name">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="interactive">
                    {item.name} <LinkArrow />
                  </a>
                ) : (
                  <span>{item.name}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* BLOGS COLUMN (0.8fr) */}
      <motion.div className="intro-cell intro-cell--blogs" variants={columnVariants}>
        <span className="cell-label">Blogs</span>
        <div className="ps-list">
          {blogs.map((item) => (
            <div key={item.id} className="ps-row">
              <span className="ps-num">{item.num}</span>
              <span className="ps-name">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="interactive">
                    {item.name} <LinkArrow />
                  </a>
                ) : (
                  <span>{item.name}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}