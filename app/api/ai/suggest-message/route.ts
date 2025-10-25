import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { generateFollowUpMessage } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, status } = await request.json();

    if (!name || !email || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const message = await generateFollowUpMessage(name, email, status);

    return NextResponse.json(
      {
        success: true,
        data: { message },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AI suggestion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
