// import { NextRequest, NextResponse } from "next/server";

// export async function POST (request: NextRequest, response: NextResponse) {
//   const signupData = request.formData();
//   console.log({ signupData });
//   // const userRes = await fetch(`${process.env.LOCAL_BACKEND_URL}/auth/signup`, {
//   //   method: "POST",
//   //   headers: { "Content-Type": "application/json" },
//   //   body: request.body,
//   //   duplex: "half",
//   // });
//   // // console.log({ userRes });
//   // const user = await userRes.json();
//   // console.log( user );
//   // // return response.json()
//   // // return user;
//   // return NextResponse.status(201).json({ message: "Hello from Next.js API!", user });
// }


// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 400 } // Bad Request
      );
    }

    console.log("Signing up user via API Route:", { email });

    // --- DATABASE LOGIC (same as before) ---
    // In a real app, you'd hash the password and save the user.
    // If the email is taken, return a 409 Conflict status.
    // --- END DATABASE LOGIC ---

    // Respond with success
    return NextResponse.json(
      { message: "User created successfully." },
      { status: 201 } // Created
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 } // Internal Server Error
    );
  }
}