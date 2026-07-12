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
});
