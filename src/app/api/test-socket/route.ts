import { emitSocketEvent } from "@/lib/socket";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await emitSocketEvent("test", { message: "Hello world" });


 return NextResponse.json({res, success: true });
}
