'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function TermsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/contents/terms_and_conditions`)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.success) {
          setData(resJson.data);
        }
      })
      .catch(err => console.error('Error fetching terms:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafb]" style={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '80px 24px 100px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div className="adm_spinner" style={{ margin: '0 auto 16px' }} />
            Loading terms & conditions...
          </div>
        ) : data ? (
          <article style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#113c34', marginBottom: '8px' }}>
              {data.title || 'Terms & Conditions'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              Last updated: {new Date(data.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div 
              style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}
            >
              {data.content}
            </div>
          </article>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <h2>Document Not Available</h2>
            <p>Please check back later or contact clinic management.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
