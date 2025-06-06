import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string' || password.length < 3) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 400 } // Bad Request
      );
    }

    // 3. In a real app, you would perform database operations here:
    console.log("Login user (API Route):", { email });
    // const existingUser = await db.user.findUnique({ where: { email } });
    // if (existingUser) {
    //   return NextResponse.json({ message: "Email already in use." }, { status: 409 }); // Conflict
    // }
    // ... create user ...

    // 4. Respond with a success message
    return NextResponse.json(
      { message: "User succesfully signed in successfully." },
      { status: 201 } // Created
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}