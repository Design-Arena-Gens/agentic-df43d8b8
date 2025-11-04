import './globals.css';

export const metadata = {
  title: 'Vendor Submissions',
  description: 'Submit resources, budgets, and rate cards',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
