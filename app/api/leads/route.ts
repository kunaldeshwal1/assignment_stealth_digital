import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  await connectDB();
  const leads = await Lead.find({ userId: user.userId }).sort({
    createdAt: -1,
  });
  return NextResponse.json({ success: true, data: leads }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  const body = await req.json();
  await connectDB();
  const lead = await Lead.create({ ...body, userId: user.userId });
  return NextResponse.json({ success: true, data: lead }, { status: 201 });
}
