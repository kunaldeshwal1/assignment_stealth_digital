import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import {
  generateFollowUpMessage,
  generateMultipleMessages,
} from "@/lib/openai";
import { z } from "zod";

// Validation schema for the request body
const suggestMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["new", "contacted", "qualified", "lost"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  count: z.number().min(1).max(5).optional().default(1), // Optional: generate multiple variations
});

/**
 * POST /api/ai/suggest-message
 * Generate AI-powered follow-up message for a lead
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please log in to use this feature.",
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = suggestMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.errors[0].message,
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, status, count } = validation.data;

    // Log request for debugging
    console.log(
      `[AI Suggest] User: ${user.email}, Lead: ${name} (${email}), Status: ${status}`
    );

    // Generate message(s)
    let message: string;
    let variations: string[] | undefined;

    if (count > 1) {
      // Generate multiple variations
      variations = await generateMultipleMessages(name, email, status, count);
      message = variations[0]; // Primary message is the first one
    } else {
      // Generate single message
      message = await generateFollowUpMessage(name, email, status);
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Message generated successfully",
        data: {
          message,
          variations,
          metadata: {
            leadName: name,
            leadEmail: email,
            status,
            generatedAt: new Date().toISOString(),
            model: "llama3-8b-8192",
            provider: "Groq",
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AI suggestion error:", error);

    // Handle specific error types
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to connect to AI service. Please try again later.",
        },
        { status: 503 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        {
          success: false,
          message: "Rate limit exceeded. Please try again in a moment.",
        },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate message. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/suggest-message
 * Check if AI service is available
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if API key is configured
    const isConfigured = !!process.env.GROQ_API_KEY;

    return NextResponse.json(
      {
        success: true,
        data: {
          aiEnabled: isConfigured,
          provider: "Groq",
          model: "llama3-8b-8192",
          status: isConfigured ? "available" : "not configured",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AI status check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
