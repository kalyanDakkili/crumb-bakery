-- =============================================
-- CRUMB BAKERY — Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','baking','ready','delivered')),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (disable for simplicity with service key, or enable as needed)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
CREATE POLICY "Service role can manage products" ON products FOR ALL USING (true);

-- Orders: user can see own, admin sees all
CREATE POLICY "Service role manages all orders" ON orders FOR ALL USING (true);

-- Users: service role manages
CREATE POLICY "Service role manages users" ON users FOR ALL USING (true);

-- Seed initial products
INSERT INTO products (name, description, price, image_url, category, in_stock) VALUES
  ('Sourdough Loaf', 'Stone-baked with our 7-year-old starter. Crispy crust, chewy crumb.', 8.50, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600', 'bread', true),
  ('Croissant Butter', 'Laminated with French butter, 27 delicate layers, golden perfection.', 3.50, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600', 'pastry', true),
  ('Chocolate Éclair', 'Choux pastry filled with dark chocolate custard, topped with ganache.', 4.25, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600', 'pastry', true),
  ('Cinnamon Roll', 'Pillowy brioche dough, brown butter filling, cream cheese icing.', 4.75, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600', 'pastry', true),
  ('Almond Tart', 'Buttery shell, almond frangipane, topped with toasted sliced almonds.', 5.50, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600', 'tart', true),
  ('Blueberry Muffin', 'Double blueberry — folded and baked-in. Lemon zest sugar crust.', 3.25, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600', 'muffin', true),
  ('Focaccia Rosemary', 'Olive oil-drenched focaccia with fresh rosemary and sea salt flakes.', 6.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600', 'bread', true),
  ('Lemon Tart', 'Bright lemon curd in a crisp sablé shell, Italian meringue top.', 5.75, 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600', 'tart', true),
  ('Kouign-Amann', 'Breton butter cake — caramelized, flaky, and impossibly good.', 4.00, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600', 'pastry', true),
  ('Rye Bread Loaf', 'Scandinavian dark rye, seeds, molasses. Dense, earthy, nutritious.', 9.00, 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=600', 'bread', true),
  ('Macarons Box (6)', 'Seasonal flavors: raspberry, pistachio, salted caramel, vanilla, chocolate, earl grey.', 12.00, 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600', 'sweet', true),
  ('Apple Danish', 'Laminated pastry, spiced apple compote, apricot glaze.', 3.75, 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600', 'pastry', true)
ON CONFLICT DO NOTHING;

-- Seed admin user (password: Admin@123)
INSERT INTO users (email, name, password_hash, role) VALUES
  ('admin@crumbbakery.com', 'Bakery Admin', '$2a$12$LQv3c1yqBwEHqXbhk.7GHOGzZxUNQkL0a.3K9M1hm2j9HJi8yGFmG', 'admin')
ON CONFLICT DO NOTHING;
