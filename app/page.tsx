import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-[#fdf8f0] via-[#faefd8] to-[#f5ddb0]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#c8852a]/10 blur-3xl" />
          <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-[#e6a83c]/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-[slideUp_0.6s_ease-out]">
            <p className="text-[#c8852a] font-medium text-sm uppercase tracking-[0.2em] mb-4">
              🌾 Baked Fresh Daily
            </p>
            <h1 className="text-6xl lg:text-7xl leading-[1.05] text-[#3d2314] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Crafted with<br />
              <em>flour, butter,</em><br />
              and love.
            </h1>
            <p className="text-lg text-[#3d2314]/70 mb-10 max-w-md leading-relaxed">
              Artisan breads, flaky pastries, and seasonal tarts made from scratch every morning in our HSR Layout kitchen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-[#3d2314] text-[#f5e6d3] rounded-full text-sm font-semibold hover:bg-[#c8852a] transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Browse the Bakery →
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-[#3d2314] text-[#3d2314] rounded-full text-sm font-semibold hover:bg-[#3d2314] hover:text-[#f5e6d3] transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 mt-12">
              {[
                { icon: '🥇', label: 'Award-winning' },
                { icon: '🌿', label: 'Organic flour' },
                { icon: '🚚', label: 'Same-day delivery' },
              ].map(b => (
                <div key={b.label} className="text-center">
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs text-[#3d2314]/60 font-medium">{b.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating image grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-[fadeIn_0.8s_ease-out]">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden h-52 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400"
                  alt="Croissants"
                  width={400} height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-36 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400"
                  alt="Cinnamon rolls"
                  width={400} height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden h-36 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400"
                  alt="Eclairs"
                  width={400} height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-52 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400"
                  alt="Sourdough"
                  width={400} height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl text-[#3d2314] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            What are you craving?
          </h2>
          <p className="text-[#3d2314]/60">Every item made this morning.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Breads', emoji: '🍞', cat: 'bread', desc: 'Sourdoughs & loaves', color: 'bg-amber-50 hover:bg-amber-100', img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300' },
            { label: 'Pastries', emoji: '🥐', cat: 'pastry', desc: 'Croissants & danishes', color: 'bg-orange-50 hover:bg-orange-100', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300' },
            { label: 'Tarts', emoji: '🥧', cat: 'tart', desc: 'Fruit & cream tarts', color: 'bg-yellow-50 hover:bg-yellow-100', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300' },
            { label: 'Sweets', emoji: '🍰', cat: 'sweet', desc: 'Macarons & cakes', color: 'bg-pink-50 hover:bg-pink-100', img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=300' },
          ].map(c => (
            <Link
              key={c.cat}
              href={`/shop?category=${c.cat}`}
              className={`group rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${c.color}`}
            >
              <div className="h-32 overflow-hidden">
                <Image
                  src={c.img}
                  alt={c.label}
                  width={300} height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#3d2314] text-sm">{c.emoji} {c.label}</p>
                <p className="text-xs text-[#3d2314]/60 mt-0.5">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#3d2314] py-20 mx-4 rounded-3xl mb-8">
        <div className="text-center max-w-xl mx-auto px-4">
          <p className="text-[#e6a83c] text-sm font-medium uppercase tracking-widest mb-4">Fresh every day</p>
          <h2 className="text-4xl text-[#fdf8f0] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to order?
          </h2>
          <p className="text-[#f5e6d3]/70 mb-8">
            Browse our full catalog, add to cart, and have it delivered to your door.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-[#c8852a] text-white rounded-full text-sm font-semibold hover:bg-[#e6a83c] transition-all hover:shadow-lg"
          >
            Shop Now →
          </Link>
        </div>
      </section>
    </div>
  )
}
