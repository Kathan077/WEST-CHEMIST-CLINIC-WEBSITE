"use client";

import React from "react";
import { motion } from "framer-motion";
import "./ContactHero.css";

export default function ContactHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="heroContainer">
      <div className="backgroundEffects">
        <div className="glowOrb orb1" />
        <div className="glowOrb orb2" />
        <div className="gridOverlay" />
      </div>

      <motion.div 
        className="heroContent"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="title">
          Contact Us
        </motion.h1>
        
        <motion.p variants={itemVariants} className="subtitle">
          Experience premium care with West Chemist. 
          Reach out to our qualified team and discover how we can help you achieve your wellness goals.
        </motion.p>
      </motion.div>
    </div>
  );
}
