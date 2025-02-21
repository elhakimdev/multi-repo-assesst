import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/indonesia-province.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return new NextResponse(fileContents, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "GeoJSON not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}
