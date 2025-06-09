"use server";

import { prisma } from "@/lib/prisma";
import { saltAndHashPassword } from "./util";
import { signIn } from "./config";

// Server action for user signup
export async function signUp(email: string, password: string) {
  try {
    // Validate input
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // Password strength validation (minimum 6 characters)
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "User already exists with this email" };
    }

    // Hash the password
    const hashedPassword = saltAndHashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        hashedPassword: hashedPassword,
      },
    });

    if (user) {
      await signIn("credentials", {
        email: email.toLowerCase(),
        password: password,
        redirect: true,
      });
      return {
        success: true,
        message: "Account created successfully",
        userId: user.id,
      };
    }

    return {
      success: false,
      error: "An error occurred during signup",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An error occurred during signup" };
  }
}

// Server action for user login
export async function loginUser(email: string, password: string) {
  try {
    // Validate input
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const result = await signIn("credentials", {
      email: email.toLowerCase(),
      password: password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid credentials" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}
