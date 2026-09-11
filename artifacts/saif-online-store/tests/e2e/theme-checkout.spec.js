import { expect, test } from "@playwright/test";

const PRODUCT_NAME = "Quantum ANC Headphones";
const EXPECTED_ERRORS = [
  "Enter a valid email",
  "Enter the name on the card",
  "Enter a street address",
  "Enter a city",
  "Enter a postal code",
  "Enter a 16-digit card number",
  "MM/YY",
  "3 digits",
];

async function expectNoHorizontalClipping(locator, page) {
  const viewport = page.viewportSize();

  expect(viewport).not.toBeNull();
  await expect
    .poll(async () => {
      const box = await locator.boundingBox();
      if (!box) return false;
      return box.x >= -1 && box.x + box.width <= viewport.width + 1;
    })
    .toBe(true);
}

test("cart, configurator, checkout, validation, and persistence", async (
  { page },
  testInfo,
) => {
  const theme = testInfo.project.metadata.theme;

  await page.goto("/");
  await page.evaluate((selectedTheme) => {
    localStorage.clear();
    localStorage.setItem("auren-theme", selectedTheme);
  }, theme);
  await page.reload();

  await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`));
  await expect(
    page.getByRole("button", {
      name: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Open cart, 0 items" }).click();
  const emptyCart = page.getByRole("dialog", { name: "Shopping cart" });
  await expect(emptyCart.getByText("Your bag is empty")).toBeVisible();
  await expectNoHorizontalClipping(emptyCart, page);
  await emptyCart.getByRole("button", { name: "Continue exploring" }).click();

  const productCard = page.locator("article").filter({ hasText: PRODUCT_NAME });
  await productCard.scrollIntoViewIfNeeded();
  await productCard.getByRole("heading", { name: PRODUCT_NAME }).click();

  const configurator = page.getByRole("dialog").filter({ hasText: PRODUCT_NAME });
  await expect(configurator).toBeVisible();
  await expect(configurator.getByText("Finish — Graphite")).toBeVisible();
  await expect(configurator.getByText("Specification")).toBeVisible();
  await expectNoHorizontalClipping(configurator, page);
  await configurator.getByRole("button", { name: /Add 1 to bag/ }).click();

  const populatedCart = page.getByRole("dialog", { name: "Shopping cart" });
  await expect(populatedCart.getByText(PRODUCT_NAME)).toBeVisible();
  await expect(populatedCart.getByText("Graphite · Standard")).toBeVisible();
  await expect(populatedCart.getByRole("button", { name: "Secure checkout" })).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`));
  await expect(page.getByRole("button", { name: "Open cart, 1 item" })).toBeVisible();

  await page.getByRole("button", { name: "Open cart, 1 item" }).click();
  await page.getByRole("button", { name: "Secure checkout" }).click();

  const checkout = page.getByRole("dialog", { name: "Checkout" });
  await expect(checkout).toBeVisible();
  await expect(checkout.getByText("Contact & delivery")).toBeVisible();
  await expect(checkout.getByText("Order summary")).toBeVisible();
  await expectNoHorizontalClipping(checkout, page);

  await checkout.getByRole("button", { name: /Complete order/ }).click();
  for (const message of EXPECTED_ERRORS) {
    await expect(checkout.getByText(message, { exact: true })).toBeVisible();
  }

  await expect(checkout.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
  await expect(checkout.getByLabel("Card number")).toHaveAttribute("aria-invalid", "true");
});