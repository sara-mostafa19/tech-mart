"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { apiServices } from "@/services/api"

export default function VerifyTokenPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const router = useRouter()

  useEffect(() => {
    if (token) {
      verifyToken()
    } else {
      toast.error("No token provided")
      router.push("/auth/login")
    }
  }, [token, router])

  async function verifyToken() {
    try {
      const response = await apiServices.verifyToken(token)
      if (response.message === "success") {
        toast.success("Token verified successfully! You can now log in.")
        router.push("/auth/login")
      } else {
        toast.error(response.message || "Invalid or expired token")
        router.push("/auth/login")
      }
    } catch (error) {
      toast.error("An error occurred during verification")
      router.push("/auth/login")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Verifying Token...</h1>
      <p className="text-muted-foreground">Please wait while we verify your token.</p>
    </div>
  )
}
