import { NextResponse } from "next/server";
import { ZodError } from "zod";
import connectDB from "@/lib/db/mongoose";
import { generateCatalogMetadata } from "@/lib/services/catalog";
import { catalogRequestSchema } from "@/lib/validation/catalog";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = catalogRequestSchema.parse(body);

    await connectDB();
    const result = await generateCatalogMetadata(payload);

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
          error instanceof Error ? error.message : "Unexpected catalog error",
      },
      { status: 500 }
    );
  }
}
