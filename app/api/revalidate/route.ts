import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  revalidatePath("/");
  revalidatePath("/search");
  return NextResponse.json({ revalidated: true, time: Date.now() });
}
