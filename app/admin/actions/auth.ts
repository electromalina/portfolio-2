"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "change-this-secret-key-in-production";
const SESSION_COOKIE_NAME = "admin-session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Create a signed session token
function createSessionToken(): string {
  const payload = JSON.stringify({
    authenticated: true,
    expires: Date.now() + SESSION_DURATION,
  });
  const hmac = createHmac("sha256", SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

// Verify session token
function verifySessionToken(token: string): boolean {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
    
    // Check expiration
    if (payload.expires < Date.now()) {
      return false;
    }

    // Verify signature
    const hmac = createHmac("sha256", SECRET_KEY);
    hmac.update(JSON.stringify({ authenticated: payload.authenticated, expires: payload.expires }));
    const expectedSignature = hmac.digest("hex");
    
    // Use timing-safe comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
      return false;
    }
    
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    
    return timingSafeEqual(signatureBuffer, expectedBuffer) && payload.authenticated === true;
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set");
    return { success: false, error: "Server configuration error: ADMIN_PASSWORD not set" };
  }

  if (password !== adminPassword) {
    return { success: false, error: "Invalid password" };
  }

  try {
    // Create session token
    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to create session. Please try again." };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return verifySessionToken(token);
}

export async function requireAuth(): Promise<void> {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}

