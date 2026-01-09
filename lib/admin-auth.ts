import { NextRequest } from "next/server";

/**
 * Check if the request is from an authenticated admin
 * This is a simple implementation - in production, use proper JWT/Session authentication
 */
export function isAdminAuthenticated(request: NextRequest): boolean {
  // Check for admin token in headers (set by frontend after login)
  const adminToken = request.headers.get("x-admin-token");
  const adminEmail = request.headers.get("x-admin-email");
  
  // Verify against environment variable
  const expectedAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  if (!expectedAdminEmail) {
    console.warn("NEXT_PUBLIC_ADMIN_EMAIL not set in environment variables");
    return false;
  }
  
  // Simple check: verify email matches (in production, use proper JWT verification)
  return adminEmail === expectedAdminEmail && adminToken === "authenticated";
}

/**
 * Get admin authentication headers for API requests
 * Call this from authenticated admin pages
 */
export function getAdminHeaders(): HeadersInit {
  const adminEmail = typeof window !== "undefined" 
    ? localStorage.getItem("adminEmail") 
    : null;
  
  if (!adminEmail || adminEmail !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Not authenticated as admin");
  }
  
  return {
    "x-admin-email": adminEmail,
    "x-admin-token": "authenticated",
  };
}
