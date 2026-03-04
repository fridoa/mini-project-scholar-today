import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/validations/auth.schema";

describe("loginSchema", () => {
  it("should pass with valid email and password", async () => {
    const data = { email: "user@example.com", password: "password123" };
    await expect(loginSchema.validate(data)).resolves.toEqual(data);
  });

  it("should fail when email is empty", async () => {
    const data = { email: "", password: "password123" };
    await expect(loginSchema.validate(data)).rejects.toThrow(/email wajib diisi/i);
  });

  it("should fail when email format is invalid", async () => {
    const data = { email: "invalid-email", password: "password123" };
    await expect(loginSchema.validate(data)).rejects.toThrow(/format email tidak valid/i);
  });

  it("should fail when password is empty", async () => {
    const data = { email: "user@example.com", password: "" };
    await expect(loginSchema.validate(data)).rejects.toThrow(/password wajib diisi/i);
  });

  it("should fail when both fields are empty", async () => {
    const data = { email: "", password: "" };
    await expect(loginSchema.validate(data)).rejects.toThrow();
  });
});

describe("registerSchema", () => {
  it("should pass with valid email and password", async () => {
    const data = { email: "user@example.com", password: "password123" };
    await expect(registerSchema.validate(data)).resolves.toEqual(data);
  });

  it("should fail when email is empty", async () => {
    const data = { email: "", password: "password123" };
    await expect(registerSchema.validate(data)).rejects.toThrow(/email wajib diisi/i);
  });

  it("should fail when email format is invalid", async () => {
    const data = { email: "not-an-email", password: "password123" };
    await expect(registerSchema.validate(data)).rejects.toThrow(/format email tidak valid/i);
  });

  it("should fail when password is empty", async () => {
    const data = { email: "user@example.com", password: "" };
    await expect(registerSchema.validate(data)).rejects.toThrow(/password wajib diisi/i);
  });

  it("should fail when password is less than 6 characters", async () => {
    const data = { email: "user@example.com", password: "12345" };
    await expect(registerSchema.validate(data)).rejects.toThrow(/password minimal 6 karakter/i);
  });

  it("should pass when password is exactly 6 characters", async () => {
    const data = { email: "user@example.com", password: "123456" };
    await expect(registerSchema.validate(data)).resolves.toEqual(data);
  });

  it("should fail when password exceeds 20 characters", async () => {
    const data = { email: "user@example.com", password: "a".repeat(21) };
    await expect(registerSchema.validate(data)).rejects.toThrow(/password maksimal 20 karakter/i);
  });

  it("should pass when password is exactly 20 characters", async () => {
    const data = { email: "user@example.com", password: "a".repeat(20) };
    await expect(registerSchema.validate(data)).resolves.toEqual(data);
  });
});
