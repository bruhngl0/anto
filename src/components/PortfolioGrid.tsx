"use client";

import { GridItem } from "../data/defaultConfig";
import { motion } from "framer-motion";
import LinkArrow from "./LinkArrow";

interface PortfolioGridProps {
  gridItems: GridItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

export default function PortfolioGrid({ gridItems }: PortfolioGridProps) {
  return (
    <motion.section
      className="element-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {gridItems.map((item, index) => {
        if (item.type === "text") {
          return (
            <motion.div
              key={item.id || `text-${index}`}
              className="element"
              variants={itemVariants}
            >
              <span className="el-num">{item.num}</span>
              <span className="el-sym">{item.symbol}</span>
              <span className="el-name">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive"
                  >
                    {item.name} <LinkArrow />
                  </a>
                ) : (
                  item.name
                )}
              </span>
              <span className="el-cat">{item.category}</span>
            </motion.div>
          );
        } else if (item.type === "media") {
          return (
            <motion.div
              key={item.id || `media-${index}`}
              className="element element--media interactive"
              data-title={item.title}
              variants={itemVariants}
            >
              {item.mediaType === "video" ? (
                <video
                  src={item.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  loading="lazy"
                />
              )}
            </motion.div>
          );
        } else {
          return (
            <motion.div
              key={item.id || `empty-${index}`}
              className="element--empty"
              variants={itemVariants}
            />
          );
        }
      })}
    </motion.section>
  );
}
