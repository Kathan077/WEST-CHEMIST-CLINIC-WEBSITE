"use client";

import React from "react";
import styles from "./page.module.css";
import ContactHero from "../../components/contact/ContactHero";
import ContactInfo from "../../components/contact/ContactInfo";
import ContactForm from "../../components/contact/ContactForm";
import MapSection from "../../components/contact/MapSection";

export default function ContactPage() {
  return (
    <main className={styles.contactPage}>
      <ContactHero />
      
      <div className={styles.contentWrapper}>
        <div className={styles.mainGrid}>
          <ContactInfo />
          <ContactForm />
        </div>
        <MapSection />
      </div>
    </main>
  );
}
