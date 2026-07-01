export const metadata = {
  title: 'West Chemist - Admin Portal',
  description: 'West Chemist Clinic Administrative Dashboard',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
