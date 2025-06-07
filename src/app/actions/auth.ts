import { , FormDa } from "react-dom";

export async function signup(state: FormState, formData: FormData) {
  event.preventDefault();

  if (password !== confirm) {
    return setError("Passwords must match.");
  }

  try {
    const res = await fetch(`${process.env.LOCAL_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirm }),
    });

    if (res.ok) {
      router.push("/login"); // Redirect on success
    } else {
      const errorData = await res.json();
      setError(errorData.message || "Failed to sign up.");
    }
  } catch (err) {
    setError("An unexpected error occurred. Please try again.");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
