'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import '../legal.css';

const FALLBACK_PRIVACY = {
  title: 'Privacy Policy',
  updatedAt: '2026-01-01',
  sections: [
    {
      num: '1',
      title: 'Who We Are',
      content: `West Chemist Pharmacy (operated by Kalki Health Ltd) provides community and healthcare pharmacy services across 2 pharmacy branches:
• Northampton Branch (Registered Pharmacy): 4 Kingsley Park Terrace, Northampton, NN2 7HG (GPhC Reg No: 1035465)
• East London Branch: East London Consultation Hub, UK
Superintendent Pharmacist: Viren Bhatia | Contact: kalkihealthltd@gmail.com | (01604) 713297`
    },
    {
      num: '2',
      title: 'Information We Collect',
      content: `We collect only the basic information you submit when booking an appointment or contacting us:
• Patient Details: Full name and UK mobile number.
• Booking Preferences: Selected pharmacy branch (Northampton or East London Hub), pharmacy service, preferred date, and time slot.
• Technical Data: Essential session cookies required for website navigation.
Note: We do not collect online payments, and we do not request or store digital identity documents on this website.`
    },
    {
      num: '3',
      title: 'How Your Booking is Processed & Approved',
      content: `• Provisional Request: When you book online, your submission is received as a provisional appointment request.
• Admin Review & Approval: Your booking is reviewed by our pharmacy administrator or Superintendent Pharmacist in our secure admin portal.
• Confirmation: The appointment is only officially confirmed once approved from the admin side.
• Tracking: You can check the live approval status of your booking at any time using your mobile number on our Track Booking page.`
    },
    {
      num: '4',
      title: 'How We Use and Protect Your Data',
      content: `• Pharmacy Care: To schedule your consultation and deliver safe healthcare services.
• Confidentiality: Your details are kept strictly confidential and are never sold or shared with third parties for marketing.
• In-Person Check-In: Basic identity verification is conducted verbally or in person at the pharmacy counter when you arrive.
• NHS Continuity: Where required for healthcare safety, our pharmacists may share treatment records with your registered NHS GP.`
    },
    {
      num: '5',
      title: 'Your Rights & Inquiries',
      content: `Under UK GDPR, you have the right to access, update, or request the removal of your booking records. To make an inquiry, contact us at:
• Email: kalkihealthltd@gmail.com
• Phone: (01604) 713297
• Locations: Northampton Pharmacy (4 Kingsley Park Terrace, NN2 7HG) & East London Consultation Hub`
    }
  ]
};

export default function PrivacyPolicyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/contents/privacy_policy`)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.success && resJson.data) {
          setData(resJson.data);
        }
      })
      .catch(err => console.error('Error fetching privacy policy:', err));
  }, []);

  // Parse raw text into simple sections if fetched from backend string
  const parseRawContent = (rawText) => {
    if (!rawText) return FALLBACK_PRIVACY.sections;
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

    return sections.length > 0 ? sections : FALLBACK_PRIVACY.sections;
  };

  const sectionsToRender = data?.content ? parseRawContent(data.content) : FALLBACK_PRIVACY.sections;
  const lastUpdated = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '1 January 2026';

  return (
    <div className="legal_simple_wrap">
      <article className="legal_simple_container">
        <header className="legal_simple_header">
          <h1 className="legal_simple_title">{data?.title || 'Privacy Policy'}</h1>
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
