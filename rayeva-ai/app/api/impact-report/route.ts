import { NextResponse } from "next/server";
import { ZodError } from "zod";
import connectDB from "@/lib/db/mongoose";
import { generateImpactReport } from "@/lib/services/impact";
import { impactRequestSchema } from "@/lib/validation/impact";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = impactRequestSchema.parse(body);

    await connectDB();
    const result = await generateImpactReport(payload);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unexpected impact error",
      },
      { status: 500 }
    );
  }
}
