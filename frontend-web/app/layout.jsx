import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export const metadata = {
  title: "West Chemist | Professional Pharmacy Services",
  description: "West Chemist offers premium pharmacy, weight management, and vaccination services. Book your appointment today.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Early DNS Prefetch & Preconnect for maximum loading speed */}
        <link rel="preconnect" href="https://west-chemist-clinic-website.onrender.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://west-chemist-clinic-website.onrender.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
