'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import '../legal.css';

const FALLBACK_TERMS = {
  title: 'Terms of Service',
  updatedAt: '2026-01-01',
  sections: [
    {
      num: '1',
      title: 'About These Terms',
      content: `These Terms govern your use of www.westchemist.co.uk and our pharmacy appointment booking system operated by Kalki Health Ltd (trading as West Chemist). We operate healthcare and pharmacy services across our 2 pharmacy branches:
• Northampton Branch (Flagship Pharmacy): 4 Kingsley Park Terrace, Northampton, NN2 7HG (GPhC Reg No: 1035465)
• East London Branch: East London Consultation Hub, UK
Superintendent Pharmacist: Viren Bhatia.`
    },
    {
      num: '2',
      title: 'Services Provided',
      content: `West Chemist provides in-person pharmacy services, including NHS Pharmacy First, travel vaccinations, private health consultations, weight management consultations, ear microsuction, and NHS prescription services.`
    },
    {
      num: '3',
      title: 'Appointment Booking & Mandatory Admin Approval',
      content: `• Provisional Booking: Submitting an appointment online for either pharmacy location is an initial provisional booking request. It is not an automatically guaranteed or confirmed slot.
• Mandatory Admin Approval: An appointment is officially confirmed only after our Superintendent Pharmacist or pharmacy team reviews and approves it via our pharmacy admin portal.
• Status Updates: You can view your current booking status (Pending, Approved, Rescheduled, or Rejected) on our Track Booking page.
• Pharmacy Attendance: Please arrive 5–10 minutes before your approved appointment time at your selected pharmacy branch (Northampton or East London).`
    },
    {
      num: '4',
      title: 'Pharmacist Professional Discretion & Consultation',
      content: `• Professional Independence: An appointment booking does not guarantee the prescribing or dispensing of any medication. Our pharmacists hold full professional discretion to determine treatment suitability.
• Accurate Information: You agree to provide truthful and accurate information regarding your health and symptoms during your in-person consultation.`
    },
    {
      num: '5',
      title: 'Rescheduling & Cancellations',
      content: `• Rescheduling: If you need to change your appointment date or time, please contact the pharmacy at least 24 hours in advance.
• Pharmacy Cancellations: If a pharmacist is unavailable or a slot cannot be accommodated, the pharmacy reserves the right to reschedule or reject the booking and will notify you.`
    },
    {
      num: '6',
      title: 'Medical Emergencies & Contact',
      content: `West Chemist does not provide emergency medical services. In a life-threatening emergency, immediately call 999 or visit your nearest NHS A&E.
• Northampton Branch: 4 Kingsley Park Terrace, Northampton, NN2 7HG | Tel: (01604) 713297
• East London Branch: East London Consultation Hub, UK
• Pharmacy Email: kalkihealthltd@gmail.com`
    }
  ]
};

export default function TermsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/contents/terms_and_conditions`)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.success && resJson.data) {
          setData(resJson.data);
        }
      })
      .catch(err => console.error('Error fetching terms:', err));
  }, []);

  // Parse raw text into simple sections if fetched from backend string
  const parseRawContent = (rawText) => {
    if (!rawText) return FALLBACK_TERMS.sections;
    const lines = rawText.split('\n');
    const sections = [];
    let currentSec = null;

    lines.forEach(line => {
      const match = line.match(/^(\d+)\.\s+(.*)$/);
      if (match) {
        if (currentSec) sections.push(currentSec);
        currentSec = {
          num: match[1],
          title: match[2].trim(),
          content: ''
        };
      } else if (currentSec) {
        currentSec.content += (currentSec.content ? '\n' : '') + line;
      }
    });
    if (currentSec) sections.push(currentSec);

    return sections.length > 0 ? sections : FALLBACK_TERMS.sections;
  };

  const sectionsToRender = data?.content ? parseRawContent(data.content) : FALLBACK_TERMS.sections;
  const lastUpdated = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '1 January 2026';

  return (
    <div className="legal_simple_wrap">
      <article className="legal_simple_container">
        <header className="legal_simple_header">
          <h1 className="legal_simple_title">{data?.title || 'Terms of Service'}</h1>
          <div className="legal_simple_meta">
            <span>Last updated: {lastUpdated}</span>
            <span className="dot">•</span>
            <span className="highlight">West Chemist (Kalki Health Ltd)</span>
            <span className="dot">•</span>
            <span>GPhC Reg No: 1035465</span>
            <span className="dot">•</span>
            <span>Northampton & East London, UK</span>
          </div>
        </header>

        <div className="legal_simple_body">
          {sectionsToRender.map((sec, idx) => (
            <section key={idx} className="legal_simple_section">
              <h2>{sec.num}. {sec.title}</h2>
              <p>{sec.content}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
