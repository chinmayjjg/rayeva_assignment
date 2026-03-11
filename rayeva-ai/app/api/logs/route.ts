import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import AILog from "@/lib/db/models/AILog";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();

  const logs = await AILog.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({
    success: true,
    data: logs.map((log) => ({
      ...log,
      _id: log._id.toString(),
    })),
  });
}
