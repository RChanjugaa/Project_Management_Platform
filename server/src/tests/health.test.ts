import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("API foundation", () => {
  const app = createApp();

  it("returns HTTP 200 for the health endpoint", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("returns HTTP 404 for an unknown endpoint", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("rejects an invalid login request before database access", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "not-an-email",
      password: ""
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed.");
  });

  it.each([
    "/api/v1/users",
    "/api/v1/projects",
    "/api/v1/tasks",
    "/api/v1/notifications",
    "/api/v1/activity-logs"
  ])("protects %s when the authentication cookie is missing", async (path) => {
    const response = await request(app).get(path);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
  });

  it("rejects an invalid authentication cookie", async () => {
    const response = await request(app).get("/api/v1/auth/me").set("Cookie", "access_token=invalid-token");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired session.");
  });

  it("logout clears the authentication cookie", async () => {
    const response = await request(app).post("/api/v1/auth/logout");
    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]?.[0]).toContain("access_token=");
    expect(response.headers["set-cookie"]?.[0]).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/);
  });
});
