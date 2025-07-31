import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { name, email, password, role = "viewer" } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ecommerce_crm")
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",
      createdAt: new Date(),
      lastLogin: null,
    })

    // Generate token
    const token = generateToken(result.insertedId.toString(), email, role)

    const user = {
      id: result.insertedId.toString(),
      name,
      email,
      role,
    }

    return NextResponse.json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
