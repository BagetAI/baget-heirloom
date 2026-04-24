import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heirloom | Neighborhood Homemade Marketplace",
  description: "Authentic homemade meals from your neighbors for $11. Permitted kitchens, zero-waste packaging, real nourishment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&family=Noto+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header>
          <nav>
            <div className="logo">HEIRLOOM</div>
            <div className="nav-links">
              <a href="/#marketplace">Marketplace</a>
              <a href="/#how-it-works">How it Works</a>
              <a href="/onboard" className="btn-outline">Start Your Kitchen</a>
            </div>
          </nav>
        </header>
        {children}
        <footer>
          <div className="container footer-content">
            <div className="footer-logo">HEIRLOOM</div>
            <div className="footer-bottom">
              <p>&copy; 2026 Heirloom Marketplace. Supporting neighborhood cooks in Texas and California.</p>
              <div className="footer-links">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
