import { z } from "zod";

export const cartItemSchema = z.object({ productId: z.string().min(1), variantId: z.string().min(1).optional(), quantity: z.number().int().min(1).max(20) });
export const cartUpdateSchema = z.object({ quantity: z.number().int().min(1).max(20) });
export const couponSchema = z.object({ code: z.string().trim().min(3).max(32).transform((value) => value.toUpperCase()) });
export const addressSchema = z.object({ recipient: z.string().trim().min(2).max(100), line1: z.string().trim().min(3).max(120), line2: z.string().trim().max(120).optional(), city: z.string().trim().min(2).max(80), state: z.string().trim().max(80).optional(), postalCode: z.string().trim().min(2).max(20), country: z.string().trim().length(2).transform((value) => value.toUpperCase()), isDefault: z.boolean().optional() });
export const checkoutSchema = z.object({ addressId: z.string().min(1) });
export const shippingSchema = z.object({ postalCode: z.string().trim().min(2).max(20), country: z.string().trim().length(2) });
export const productCreateSchema = z.object({ name: z.string().trim().min(2).max(160), description: z.string().trim().min(10).max(5000), shortDescription: z.string().trim().min(5).max(300), brand: z.string().trim().min(2).max(80), categoryId: z.string().min(1), price: z.number().positive(), compareAtPrice: z.number().positive().optional(), stock: z.number().int().nonnegative(), imageUrl: z.url().optional() });
