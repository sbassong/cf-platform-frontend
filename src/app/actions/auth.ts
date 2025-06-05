"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// represent a state that the form can be in.
type FormState = {
  success: boolean;
  message: string;
};

export async function signUpAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirm = formData.get("confirm");

  // Basic validation
  if (!name) {
    return {success: false, message: "Passwords must match."}
  }
  if (!email || !password) {
    return { success: false, message: "Invalid email or password." };
  }
  if (password !== confirm) {
    return {success: false, message: "Passwords must match."}
  }

  console.log("Signing up user:", { email });

  // --- DATABASE LOGIC ---
  // In a real app, you would:
  // 1. Hash the password.
  // 2. Save the user to your database.
  // 3. Handle potential errors (e.g., email already exists).
  // const isEmailTaken = await db.user.findUnique({ where: { email } });
  // if (isEmailTaken) return { success: false, message: "Email already taken." };
  // await db.user.create({ data: { email, hashedPassword } });
  // --- END DATABASE LOGIC ---

  // On successful signup, revalidate the path and redirect.
  revalidatePath("/");
  redirect("/signin"); // Redirect to sign-in page after successful signup
}

// --- SIGN IN ACTION ---
export async function signInAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Signing in user:", { email });

  // --- DATABASE LOGIC ---
  // In a real app, you would:
  // 1. Find the user by email in your database.
  // 2. Compare the provided password with the stored hashed password.
  // 3. If they match, create a session (e.g., using a library like next-auth or a JWT).
  // --- END DATABASE LOGIC ---

  // Simulate a successful login for this example
  if (email === "test@example.com" && password === "password123") {
    // In a real app, you'd set a cookie/session here.
    redirect("/dashboard");
  }

  return { success: false, message: "Invalid credentials." };
}
