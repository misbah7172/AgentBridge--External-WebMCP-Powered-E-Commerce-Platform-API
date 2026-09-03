import { expect, test } from "@playwright/test";

const enabled = Boolean(process.env.E2E_BASE_URL && process.env.E2E_EMAIL && process.env.E2E_PASSWORD);
test.skip(!enabled, "Set E2E_BASE_URL, E2E_EMAIL, and E2E_PASSWORD for an isolated adapter deployment.");

test("WebMCP search, detail, cart add/remove, and cart UI use a disposable deployment", async ({ page }) => {
  await page.addInitScript(() => {
    const tools: Record<string, { execute: (args: Record<string, unknown>) => Promise<unknown> }> = {};
    Object.defineProperty(document, "modelContext", { configurable: true, value: { registerTool: (tool: { name: string; execute: (args: Record<string, unknown>) => Promise<unknown> }) => { tools[tool.name] = tool; } } });
    (window as Window & { __webmcpTools?: typeof tools }).__webmcpTools = tools;
  });
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(process.env.E2E_EMAIL!);
  await page.locator('input[name="password"]').fill(process.env.E2E_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/account/);
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => Object.keys((window as Window & { __webmcpTools: Record<string, unknown> }).__webmcpTools))).toContain("search_products");
  const product = await page.evaluate(async () => {
    const tools = (window as Window & { __webmcpTools: Record<string, { execute: (args: Record<string, unknown>) => Promise<any> }> }).__webmcpTools;
    const catalog = await tools.filter_products.execute({ availability: "in_stock" });
    if (!catalog.success || !catalog.data?.products?.[0]) throw new Error("No dynamically discovered product is available in the test catalog.");
    const query = catalog.data.products[0].name;
    const found = await tools.search_products.execute({ query });
    if (!found.success || !found.data?.products?.[0]) throw new Error("The dynamically discovered product could not be searched.");
    const first = found.data.products[0];
    const detail = await tools.get_product_details.execute({ productId: first.id });
    if (!detail.success) throw new Error("Product details request failed.");
    const added = await tools.add_to_cart.execute({ productId: first.id, quantity: 1 });
    if (!added.success) throw new Error("Add to cart failed.");
    return { name: first.name, itemId: added.data.items.find((item: { product: { id: string } }) => item.product.id === first.id).id };
  });
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: product.name })).toBeVisible();
  await page.evaluate(async ({ itemId }) => {
    const tools = (window as Window & { __webmcpTools: Record<string, { execute: (args: Record<string, unknown>) => Promise<any> }> }).__webmcpTools;
    const cart = await tools.get_cart.execute({});
    if (!cart.success || !cart.data.items.some((item: { id: string }) => item.id === itemId)) throw new Error("Cart inspection did not observe the added item.");
    const removed = await tools.remove_from_cart.execute({ itemId });
    if (!removed.success) throw new Error("Remove from cart failed.");
  }, product);
  await page.reload();
  await expect(page.getByText("Your cart is empty.")).toBeVisible();
});
