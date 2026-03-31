export interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  rating: number
  imageHeight: number
}

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books']

const productNames = [
  'Wireless Noise-Cancelling Headphones',
  'Ultra-Slim Mechanical Keyboard',
  'Smart Home Hub Pro',
  'Premium Cotton Crew Neck T-Shirt',
  'Ergonomic Office Chair with Lumbar Support',
  'Portable Bluetooth Speaker System',
  'Organic Green Tea Collection',
  'LED Desk Lamp with USB Charging',
  'Stainless Steel Water Bottle',
  'Fitness Tracker Watch',
  'Cast Iron Dutch Oven',
  'Bamboo Cutting Board Set',
  'Insulated Travel Mug',
  'Yoga Mat with Carrying Strap',
  'Running Shoes Pro',
  'Backpack with Laptop Compartment',
  'Digital Drawing Tablet',
  'Noise-Cancelling Earbuds',
  'Smart Thermostat',
  'Electric Standing Desk',
]

const descriptions = [
  'Experience premium sound quality with advanced active noise cancellation technology. Features 30-hour battery life and comfortable memory foam ear cushions for all-day wear.',
  'Compact and responsive mechanical keyboard with hot-swappable switches, RGB backlighting, and a sleek aluminum frame. Perfect for both work and gaming.',
  'Control all your smart home devices from one central hub. Compatible with major ecosystems including voice assistants and automation platforms.',
  'Crafted from 100% organic cotton with a relaxed fit. Pre-shrunk fabric ensures lasting comfort wash after wash.',
  'Designed for long hours at the desk with adjustable lumbar support, breathable mesh back, and customizable armrests. Supports up to 300 lbs.',
  'Room-filling sound in a compact, waterproof design. Features 360-degree audio, 20-hour playtime, and multi-device pairing.',
  'A curated selection of premium loose-leaf green teas sourced from small farms. Includes Sencha, Dragon Well, and Gyokuro varieties.',
  'Sleek LED desk lamp with adjustable color temperature, brightness levels, and a built-in USB-A charging port. Touch controls with memory function.',
  'Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid.',
  'Track steps, heart rate, sleep quality, and more. Water-resistant with a 7-day battery life and smartphone notifications.',
  'Heavy-duty enameled cast iron with excellent heat distribution. Oven-safe to 500F. Perfect for braising, roasting, and baking.',
  'Set of three bamboo cutting boards in varying sizes. Natural antimicrobial properties, gentle on knife edges, and easy to clean.',
  'Triple-insulated travel mug with leak-proof lid. Keeps coffee hot for 6+ hours. Fits standard car cup holders.',
  'Extra-thick 6mm yoga mat with alignment guide markings. Non-slip surface on both sides. Includes adjustable carrying strap.',
  'Lightweight and responsive running shoes with cushioned soles and breathable mesh upper. Ideal for road running and daily training.',
  'Durable 40L backpack with padded laptop compartment, multiple organizer pockets, and water-resistant coating. Comfortable even fully loaded.',
  'Pressure-sensitive drawing tablet with 8192 levels, tilt recognition, and express keys. Compatible with major creative software.',
  'True wireless earbuds with hybrid noise cancellation, transparency mode, and spatial audio. IPX5 water resistant with wireless charging case.',
  'Energy-saving smart thermostat that learns your schedule and preferences. Remote control via app. Compatible with most HVAC systems.',
  'Height-adjustable electric standing desk with programmable memory presets, cable management tray, and anti-collision technology.',
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateProducts(count: number): Product[] {
  const rand = seededRandom(123)
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: productNames[i % productNames.length] + (i >= productNames.length ? ` v${Math.floor(i / productNames.length) + 1}` : ''),
    description: descriptions[i % descriptions.length],
    category: categories[Math.floor(rand() * categories.length)],
    price: Math.floor(rand() * 300 + 10) + 0.99,
    rating: Math.floor(rand() * 20 + 30) / 10,
    imageHeight: Math.floor(rand() * 120 + 100),
  }))
}

export const products = generateProducts(40)
