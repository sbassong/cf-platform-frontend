import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("access_token");

  if (!accessTokenCookie) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/session`,
      {
        headers: {
          Cookie: `access_token=${accessTokenCookie?.value}`,
        },
        cache: "no-store",
      }
    );

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return new NextResponse(JSON.stringify({message: data.message}), {
        status: backendResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[API/AUTH/SESSION] Error fetching session:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error while fetching session.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}