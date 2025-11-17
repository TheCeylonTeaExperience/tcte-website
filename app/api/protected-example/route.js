import { NextResponse } from "next/server";

export async function GET(request) {
  const userHeader = request.headers.get("x-user");

  if (!userHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(userHeader);

  return NextResponse.json({
    message: "Protected data fetched successfully",
    user,
  });
}
