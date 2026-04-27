import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { CartProvider } from '@/components/CartProvider'
import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Crumb — Artisan Bakery',
  description: 'Fresh-baked goods crafted with love. Order online for pickup or delivery.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <footer className="bg-[#3d2314] text-[#f5e6d3] py-12 mt-16">
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Crumb</h3>
                  <p className="text-sm opacity-70">Artisan breads & pastries baked fresh every morning since 2018.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-3">Hours</p>
                  <p className="text-sm opacity-80">Mon–Fri: 7am – 7pm</p>
                  <p className="text-sm opacity-80">Sat–Sun: 8am – 5pm</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-3">Contact</p>
                  <p className="text-sm opacity-80">hello@crumbbakery.com</p>
                  <p className="text-sm opacity-80">HSR Layout, Bengaluru</p>
                </div>
              </div>
              <div className="max-w-6xl mx-auto px-4 pt-8 mt-8 border-t border-white/10 text-center text-xs opacity-40">
                © 2024 Crumb Bakery. All rights reserved.
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
