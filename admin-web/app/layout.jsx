export const metadata = {
  title: 'West Chemist - Admin Portal',
  description: 'West Chemist Administrative Dashboard',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Early DNS Prefetch & Preconnect for backend & Cloudinary */}
        <link rel="preconnect" href="https://west-chemist-clinic-website.onrender.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://west-chemist-clinic-website.onrender.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
