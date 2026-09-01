import { describe, expect, it } from "vitest";
import { shippingEstimate } from "@/lib/services/orders";
describe("shipping estimates", () => { it("offers free domestic shipping above the threshold", () => { expect(shippingEstimate("10001", "US", 500)).toMatchObject({ available: true, estimatedDays: 3, shippingCost: 0 }); }); it("prices international shipments separately", () => { expect(shippingEstimate("SW1A 1AA", "GB", 100)).toMatchObject({ shippingCost: 28, estimatedDays: 8 }); }); });
