import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";


export const metadata = {
  title: "West Chemist Clinic | Professional Healthcare Services",
  description: "West Chemist Clinic offers premium healthcare, weight loss, and vaccination services. Book your appointment today.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
