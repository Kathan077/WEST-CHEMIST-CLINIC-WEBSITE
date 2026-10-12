"use client";
import React, { useState, useEffect } from 'react';
import VaccinationHero from '../../components/vaccination/VaccinationHero';
import VaccinationGrid from '../../components/vaccination/VaccinationGrid';
import VaccinationProcess from '../../components/vaccination/VaccinationProcess';
import VaccinationFAQ from '../../components/vaccination/VaccinationFAQ';
import { API_URL } from '@/config';

export default function VaccinationContent({ initialCMS }) {
  const [cms, setCms] = useState(initialCMS || {});

  useEffect(() => {
    const fetchLatestCMS = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vaccination-cms?t=${Date.now()}`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) {
          setCms(json.data);
        }
      } catch (err) {
        console.error("Error refreshing Vaccination CMS in background:", err);
      }
    };
    fetchLatestCMS();
  }, []);

  return (
    <div className="min-h-screen">
      <VaccinationHero initialHero={cms.hero} />
      <VaccinationGrid initialGridHeader={cms.gridHeader} />
      <VaccinationProcess initialProcess={cms.process} />
      <VaccinationFAQ initialFaqs={cms.faqs} />
    </div>
  );
}
