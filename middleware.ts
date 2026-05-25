import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "change-this-secret-key-in-production";
const SESSION_COOKIE_NAME = "admin-session";

// Helper to decode base64 (Edge runtime compatible)
function base64Decode(str: string): string {
  try {
    // Convert base64 to binary string
    const binaryString = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    // Convert binary string to UTF-8
    return decodeURIComponent(
      binaryString
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
}

// Verify session token using Web Crypto API (Edge runtime compatible)
async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) {
      return false;
    }

    // Decode payload - use the exact same payload string that was used to create the signature
    const payloadStr = base64Decode(payloadBase64);
    const payload = JSON.parse(payloadStr);
    
    // Check expiration
    if (payload.expires < Date.now()) {
      return false;
    }

    // Verify signature using Web Crypto API
    // IMPORTANT: Use the exact same payload string that was used to create the signature
    // This must match auth.ts: createSessionToken() where we do JSON.stringify(payload)
    const encoder = new TextEncoder();
    // Use the original payload string, not a re-stringified version
    const data = encoder.encode(payloadStr);
    const keyData = encoder.encode(SECRET_KEY);
    
    // Import key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    // Generate signature
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const expectedSignatureArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = expectedSignatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Compare signatures (case-insensitive for hex)
    const signatureHex = signature.toLowerCase();
    const expectedSignatureHex = expectedSignature.toLowerCase();
    
    return signatureHex === expectedSignatureHex && payload.authenticated === true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token (async)
    const isValid = await verifySessionToken(token);
    if (!isValid) {
      // Invalid token, redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};

