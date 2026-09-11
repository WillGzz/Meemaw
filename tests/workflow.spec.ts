import { test, expect } from "@playwright/test";
import Database from "better-sqlite3";
import { resolve } from "node:path";

test("relative registration → approval → elder asks and gives feedback", async ({ browser }) => {
  const suffix = Date.now().toString();
  const relativeEmail = `relative-${suffix}@example.test`;
  const elderEmail = `elder-${suffix}@example.test`;
  const relativeContext = await browser.newContext();
  const elderContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const relative = await relativeContext.newPage();
  const elder = await elderContext.newPage();
  const errors: string[] = [];
  relative.on("pageerror", error => errors.push(error.message)); elder.on("pageerror", error => errors.push(error.message));
  try {
    await relative.goto("/relative-setup");
    await relative.getByLabel("Your name", { exact: true }).fill("Rex Browser Test");
    await relative.getByLabel("Instagram username").fill("rex_test");
    await relative.getByLabel("Email", { exact: true }).fill(relativeEmail);
    await relative.getByLabel("Password", { exact: true }).fill("a-long-test-password");
    await relative.getByRole("button", { name: "Create account", exact: true }).click();
    await expect(relative.getByRole("heading", { name: "Hello, Rex Browser Test." })).toBeVisible();
    const code = (await relative.locator(".family-code").innerText()).trim();
    await expect(relative.getByText("Account connections are being set up.", { exact: false })).toBeVisible();
    await elder.goto("/");
    await elder.getByRole("button", { name: "I'm using Meemaw", exact: false }).click();
    await elder.getByRole("button", { name: "Continue", exact: true }).click();
    await elder.getByLabel("Your name", { exact: true }).fill("Ama Browser Test");
    await elder.getByRole("button", { name: "Continue", exact: true }).click();
    await elder.getByLabel("Email", { exact: true }).fill(elderEmail);
    await elder.getByLabel("Password", { exact: true }).fill("a-long-test-password");
    await elder.getByRole("button", { name: "Create account", exact: true }).click();
    await expect(elder.getByRole("heading", { name: "Hello, Ama Browser Test." })).toBeVisible();
    await elder.getByLabel("Family code", { exact: true }).fill(code);
    await elder.getByRole("button", { name: "Send connection request" }).click();
    await expect(elder.getByText("Waiting for approval", { exact: true })).toBeVisible();
    await expect(elder.getByRole("button", { name: "Ask about Rex Browser Test" })).toHaveCount(0);
    await relative.getByRole("button", { name: "Refresh", exact: true }).click();
    await relative.getByRole("button", { name: "Accept", exact: true }).click();
    await expect(relative.getByText("Connection approved.", { exact: true })).toBeVisible();
    await elder.getByRole("button", { name: "Refresh", exact: true }).click();
    await elder.getByRole("button", { name: "Ask about Rex Browser Test", exact: true }).click();
    await elder.getByLabel("Your question", { exact: true }).fill("What is new?");
    await elder.getByRole("button", { name: "Ask my question", exact: true }).click();
    await expect(elder.getByRole("alert")).toContainText("Family updates are not connected yet");
    // Deterministic UI fixture; real provider integration remains separately configured.
    await elder.route("**/api/elder/ask", route => route.fulfill({ json: { id: "ui-fixture", relative: { id: "fixture", name: "Rex Browser Test" }, question: "What is new?", answer: "This is a test fixture: Rex shared a family update.", activityUpdatedAt: new Date().toISOString(), sources: [], learning: { responseStyle: "short", feedbackCount: 0 }, quality: { removedItems: 0, duplicateItems: 0, cleanedAt: new Date().toISOString() } } }));
    await elder.route("**/api/elder/feedback", route => route.fulfill({ json: { preferences: { responseStyle: "short" } } }));
    await elder.getByRole("button", { name: "Ask my question", exact: true }).click();
    await expect(elder.getByText("This is a test fixture: Rex shared a family update.", { exact: true })).toBeVisible();
    await elder.getByRole("button", { name: "Keep it shorter", exact: true }).click();
    await expect(elder.getByText("I’ll ask for shorter answers next time.", { exact: true })).toBeVisible();
    await elder.screenshot({ path: "/tmp/meemaw-ask-mobile.png", fullPage: true });
    const overflow = await elder.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    await relative.setViewportSize({ width: 1440, height: 1050 });
    await relative.screenshot({ path: "/tmp/meemaw-dashboard-desktop.png", fullPage: true });
    await elder.getByRole("button", { name: "Your family", exact: true }).click();
    await elder.reload();
    await expect(elder.getByRole("button", { name: "Ask about Rex Browser Test", exact: true })).toBeVisible();
    await elder.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(elder).toHaveURL(/\/login/);
    await elder.getByLabel("Email", { exact: true }).fill(elderEmail);
    await elder.getByLabel("Password", { exact: true }).fill("a-long-test-password");
    await elder.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(elder.getByRole("button", { name: "Ask about Rex Browser Test", exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await relativeContext.close(); await elderContext.close();
    const database = new Database(process.env.DATABASE_PATH || resolve("data/meemaw.sqlite"));
    database.pragma("foreign_keys = ON");
    database.prepare("DELETE FROM users WHERE email IN (?,?)").run(relativeEmail, elderEmail);
    database.close();
  }
});

test("API rejects unsigned sessions and cross-origin writes; OAuth callback rejects missing state", async ({ request }) => {
  expect((await request.get("/api/dashboard")).status()).toBe(401);
  expect((await request.post("/api/auth/register", { data: { name: "Forgery" }, headers: { Origin: "https://untrusted.test" } })).status()).toBe(403);
  const response = await request.get("/api/one/callback?code=forged", { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect(response.headers().location).toContain("one_connect=error");
});
