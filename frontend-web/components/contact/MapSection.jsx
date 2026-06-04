"use client";

import React from "react";
import { motion } from "framer-motion";
import "./MapSection.css";

export default function MapSection() {
  const mapAddress = "4 Kingsley Park Terrace, Northampton NN2 7HG, United Kingdom";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <motion.div 
      className="mapContainer"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="West Chemist Clinic Map Location"
        className="mapIframe"
      ></iframe>

      {/* Floating premium detail capsule inside map view */}
      <div className="mapFloatingCard">
        <h4 className="mapCardTitle">Northampton Clinic</h4>
        <p className="mapCardAddress">4 Kingsley Park Terrace<br />Northampton NN2 7HG, UK</p>
        <div className="mapCardButtons">
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(mapAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mapCardBtn"
          >
            Get Directions
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
