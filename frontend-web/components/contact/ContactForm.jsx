"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ContactForm.css";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Optional: show success toast here
    }, 2000);
  };

  return (
    <motion.div 
      className="formContainer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
    >
      <div className="formHeader">
        <h2 className="formTitle">Send us a Message</h2>
        <p className="formSubtitle">Our team will get back to you within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <input type="text" className="formInput" placeholder=" " required id="name" />
          <label htmlFor="name" className="formLabel">Full Name</label>
        </div>

        <div className="formGroup">
          <input type="email" className="formInput" placeholder=" " required id="email" />
          <label htmlFor="email" className="formLabel">Email Address</label>
        </div>
        
        <div className="formGroup">
          <input type="tel" className="formInput" placeholder=" " id="phone" />
          <label htmlFor="phone" className="formLabel">Phone Number (Optional)</label>
        </div>

        <div className="formGroup">
          <textarea className="formInput" placeholder=" " required id="message"></textarea>
          <label htmlFor="message" className="formLabel">Your Message</label>
        </div>

        <motion.button 
          type="submit" 
          className="submitBtn"
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ display: "inline-block", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", width: "20px", height: "20px" }}
            />
          ) : (
            "Send Message"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
