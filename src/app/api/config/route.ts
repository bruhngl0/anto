import { NextRequest, NextResponse } from "next/server";
import { saveLiveConfig } from "../../../lib/db";
import { revalidatePath } from "next/cache";

// Simple in-memory rate limiting map for brute-force prevention
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10; // Max 10 requests
const WINDOW_MS = 60 * 1000; // per 1 minute window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > WINDOW_MS) {
    record.count = 1;
    record.lastReset = now;
    return false;
  }

  record.count += 1;
  return record.count > LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    // Basic rate limit check based on client IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { config, secret } = body;

    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json(
        { success: false, error: "ADMIN_SECRET is not configured on the server." },
        { status: 500 }
      );
    }

    // Authorize using either the custom header or the body parameter
    const headerSecret = request.headers.get("x-admin-secret");
    const providedSecret = headerSecret || secret;

    if (providedSecret !== adminSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin passcode." },
        { status: 401 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { success: false, error: "Missing config data in request body." },
        { status: 400 }
      );
    }

    const saved = await saveLiveConfig(config);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write configuration to database." },
        { status: 500 }
      );
    }

    // Purge the static cache for the home route, forcing Next.js to rebuild the page on demand
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in config update API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error." },
      { status: 500 }
    );
  }
}
