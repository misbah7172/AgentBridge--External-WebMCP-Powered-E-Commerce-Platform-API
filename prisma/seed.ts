import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const catalog = [
  ["Laptops", "MacBook Air 13-inch", "Apple", 999, 4.7], ["Laptops", "MacBook Pro 14-inch", "Apple", 1599, 4.8], ["Laptops", "XPS 13", "Dell", 1099, 4.5], ["Laptops", "ThinkPad X1 Carbon", "Lenovo", 1399, 4.7], ["Laptops", "Spectre x360 14", "HP", 1199, 4.5], ["Laptops", "Zenbook 14", "ASUS", 899, 4.4], ["Laptops", "Swift Go 14", "Acer", 749, 4.3], ["Laptops", "Surface Laptop", "Microsoft", 999, 4.4],
  ["Smartphones", "iPhone 16", "Apple", 799, 4.6], ["Smartphones", "iPhone 16 Pro", "Apple", 999, 4.7], ["Smartphones", "Galaxy S25", "Samsung", 799, 4.6], ["Smartphones", "Galaxy S25 Ultra", "Samsung", 1299, 4.8], ["Smartphones", "Pixel 9", "Google", 799, 4.5], ["Smartphones", "Pixel 9 Pro", "Google", 999, 4.6], ["Smartphones", "OnePlus 13", "OnePlus", 899, 4.5],
  ["Headphones", "WH-1000XM5", "Sony", 349, 4.7], ["Headphones", "AirPods Pro", "Apple", 249, 4.7], ["Headphones", "QuietComfort Ultra", "Bose", 429, 4.6], ["Headphones", "Momentum 4", "Sennheiser", 349, 4.5], ["Headphones", "Nothing Ear", "Nothing", 149, 4.3], ["Headphones", "Beats Studio Pro", "Beats", 349, 4.4], ["Headphones", "HDB 630", "Sennheiser", 499, 4.5],
  ["Monitors", "UltraFine 27UQ850", "LG", 449, 4.5], ["Monitors", "Odyssey G8", "Samsung", 699, 4.6], ["Monitors", "ProArt PA279CRV", "ASUS", 499, 4.6], ["Monitors", "Dell UltraSharp U2723QE", "Dell", 549, 4.7], ["Monitors", "Nitro XV272U", "Acer", 299, 4.4], ["Monitors", "ThinkVision P27u-20", "Lenovo", 529, 4.5],
  ["Keyboards", "MX Keys S", "Logitech", 119, 4.6], ["Keyboards", "G915 X", "Logitech", 229, 4.5], ["Keyboards", "K2 Pro", "Keychron", 109, 4.6], ["Keyboards", "K3 Max", "Keychron", 104, 4.5], ["Keyboards", "Apex Pro TKL", "SteelSeries", 189, 4.4], ["Keyboards", "Huntsman V3 Pro", "Razer", 219, 4.4],
  ["Mice", "MX Master 3S", "Logitech", 99, 4.7], ["Mice", "G Pro X Superlight 2", "Logitech", 159, 4.6], ["Mice", "Basilisk V3 Pro", "Razer", 159, 4.5], ["Mice", "Orochi V2", "Razer", 69, 4.4], ["Mice", "Surface Arc Mouse", "Microsoft", 79, 4.2], ["Mice", "Pro Click", "Razer", 99, 4.3],
  ["Accessories", "Thunderbolt 4 Dock", "CalDigit", 279, 4.6], ["Accessories", "USB-C Digital AV Adapter", "Apple", 69, 4.4], ["Accessories", "Anker 737 Power Bank", "Anker", 149, 4.6], ["Accessories", "GaNPrime 100W Charger", "Anker", 84, 4.5], ["Accessories", "Laptop Sleeve 14-inch", "Incase", 49, 4.3], ["Accessories", "Brio 4K Webcam", "Logitech", 179, 4.5], ["Accessories", "Stream Deck MK.2", "Elgato", 149, 4.6], ["Accessories", "T7 Shield SSD 1TB", "Samsung", 119, 4.6],
] as const;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  const categoryNames = ["Laptops", "Smartphones", "Headphones", "Monitors", "Keyboards", "Mice", "Accessories"];
  const categories = new Map<string, string>();
  for (const name of categoryNames) { const category = await prisma.category.upsert({ where: { slug: slugify(name) }, update: { name }, create: { name, slug: slugify(name) } }); categories.set(name, category.id); }
  for (const [category, name, brand, price, rating] of catalog) {
    const slug = slugify(name);
    const description = `${name} from ${brand} is selected for a dependable everyday setup. Its practical design makes it a strong fit for focused work, communication, and home-office use.`;
    await prisma.product.upsert({ where: { slug }, update: { name, brand, categoryId: categories.get(category)!, description, shortDescription: `${name} by ${brand}.`, price, compareAtPrice: price > 200 ? price + 80 : null, stock: 8 + (Math.round(price) % 32), rating, reviewCount: 12 + Math.round(rating * 21) }, create: { name, slug, brand, categoryId: categories.get(category)!, description, shortDescription: `${name} by ${brand}.`, price, compareAtPrice: price > 200 ? price + 80 : null, stock: 8 + (Math.round(price) % 32), rating, reviewCount: 12 + Math.round(rating * 21), images: { create: { url: `https://placehold.co/800x600/e2e8f0/172033?text=${encodeURIComponent(name)}`, alt: name } }, variants: { create: [{ sku: `${slug}-standard`, stock: 12, attributes: { configuration: "Standard" } }, { sku: `${slug}-plus`, price: price + 50, stock: 7, attributes: { configuration: "Plus" } }] } } });
  }
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({ where: { email: "customer@example.com" }, update: { passwordHash }, create: { email: "customer@example.com", name: "Demo Customer", passwordHash } });
  await prisma.user.upsert({ where: { email: "admin@example.com" }, update: { passwordHash, role: UserRole.ADMIN }, create: { email: "admin@example.com", name: "Demo Admin", passwordHash, role: UserRole.ADMIN } });
  await prisma.coupon.upsert({ where: { code: "WELCOME10" }, update: {}, create: { code: "WELCOME10", type: "PERCENTAGE", value: 10, minimumPurchase: 50, applicableCategoryIds: [], applicableProductIds: [] } });
  await prisma.coupon.upsert({ where: { code: "SAVE20" }, update: {}, create: { code: "SAVE20", type: "FIXED", value: 20, minimumPurchase: 200, applicableCategoryIds: [], applicableProductIds: [] } });
  await prisma.coupon.upsert({ where: { code: "FREESHIP" }, update: {}, create: { code: "FREESHIP", type: "SHIPPING", value: 0, applicableCategoryIds: [], applicableProductIds: [] } });
}
main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
