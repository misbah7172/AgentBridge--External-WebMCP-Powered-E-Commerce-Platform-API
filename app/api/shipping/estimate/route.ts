import { failure, success } from "@/lib/api";
import { shippingEstimate } from "@/lib/services/orders";
import { shippingSchema } from "@/lib/validation/commerce";
export async function GET(request: Request) { const parsed = shippingSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams)); return parsed.success ? success(shippingEstimate(parsed.data.postalCode, parsed.data.country)) : failure("VALIDATION_ERROR", "A valid postal code and country are required.", 422); }
