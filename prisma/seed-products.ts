import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const products = [
  ["Laptops", "MacBook Air 13-inch", "Apple", 999], ["Laptops", "XPS 13", "Dell", 1099], ["Laptops", "ThinkPad X1 Carbon", "Lenovo", 1399],
  ["Smartphones", "iPhone 16", "Apple", 799], ["Smartphones", "Galaxy S25", "Samsung", 799], ["Smartphones", "Pixel 9", "Google", 799],
  ["Headphones", "WH-1000XM5", "Sony", 349], ["Headphones", "AirPods Pro", "Apple", 249], ["Headphones", "QuietComfort Ultra", "Bose", 429],
  ["Monitors", "Dell UltraSharp U2723QE", "Dell", 549], ["Monitors", "UltraFine 27UQ850", "LG", 449], ["Monitors", "ProArt PA279CRV", "ASUS", 499],
  ["Keyboards", "MX Keys S", "Logitech", 119], ["Keyboards", "K2 Pro", "Keychron", 109], ["Mice", "MX Master 3S", "Logitech", 99], ["Mice", "Basilisk V3 Pro", "Razer", 159],
  ["Accessories", "Thunderbolt 4 Dock", "CalDigit", 279], ["Accessories", "Anker 737 Power Bank", "Anker", 149], ["Accessories", "Brio 4K Webcam", "Logitech", 179], ["Accessories", "T7 Shield SSD 1TB", "Samsung", 119],
] as const;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
async function main() { for (const [categoryName, name, brand, price] of products) { const category = await prisma.category.upsert({ where: { slug: slugify(categoryName) }, update: { name: categoryName }, create: { name: categoryName, slug: slugify(categoryName) } }); const slug = slugify(name); const description = `${name} from ${brand} is a carefully selected ${categoryName.toLowerCase().slice(0, -1)} for reliable daily work, communication, and a well-equipped home office.`; await prisma.product.upsert({ where: { slug }, update: { name, brand, categoryId: category.id, description, shortDescription: `${name} by ${brand}.`, price, stock: 20 }, create: { name, slug, brand, categoryId: category.id, description, shortDescription: `${name} by ${brand}.`, price, stock: 20, rating: 4.5, reviewCount: 0, images: { create: { url: `https://placehold.co/800x600/e2e8f0/172033?text=${encodeURIComponent(name)}`, alt: name } }, variants: { create: { sku: `${slug}-standard`, stock: 20, attributes: { configuration: "Standard" } } } } }); } }
main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
