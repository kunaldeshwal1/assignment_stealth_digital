import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";
import { getUserFromRequest } from "@/lib/auth";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["new", "contacted", "qualified", "lost"]).optional(),
});

// GET all leads
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build query
    const query: any = { userId: user.userId };

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: leads,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new lead
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const lead = await Lead.create({
      ...validation.data,
      userId: user.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully",
        data: lead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
