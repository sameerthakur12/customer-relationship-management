"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("crm_token")
      const savedUser = localStorage.getItem("crm_user")

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("crm_token")
          localStorage.removeItem("crm_user")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        if (typeof window !== "undefined") {
          localStorage.setItem("crm_token", data.token)
          localStorage.setItem("crm_user", JSON.stringify(data.user))
        }
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error occurred" }
    }
  }

  const signup = async (name, email, password, role = "viewer") => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        if (typeof window !== "undefined") {
          localStorage.setItem("crm_token", data.token)
          localStorage.setItem("crm_user", JSON.stringify(data.user))
        }
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, error: "Network error occurred" }
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("crm_token")
      localStorage.removeItem("crm_user")
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
