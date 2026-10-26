"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getDashboardUrl, getUserRole, getRoleDisplayName } from "@/lib/roles"
import { Loader2, Home, ShieldCheck } from "lucide-react"

export default function DashboardDispatcher() {
  const router = useRouter()
  const [statusText, setStatusText] = useState("Checking permissions...")

  useEffect(() => {
    async function routeToDashboard() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          router.replace("/login?redirect=/dashboard")
          return
        }

        const role = getUserRole(user)
        const targetUrl = getDashboardUrl(user)
        const roleDisplay = getRoleDisplayName(role)

        setStatusText(`Welcome, ${user.user_metadata?.full_name || "User"}! Redirecting to ${roleDisplay} Dashboard...`)
        
        // Fast redirect to their respective dashboard
        setTimeout(() => {
          router.replace(targetUrl)
        }, 400)
      } catch (err) {
        console.error("Dashboard routing error:", err)
        router.replace("/login")
      }
    }

    routeToDashboard()
  }, [router])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 shadow-sm">
        <Home className="w-8 h-8 text-blue-600 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Accessing Your Dashboard</h2>
      <p className="text-gray-500 mb-6 max-w-sm text-sm">{statusText}</p>
      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading your personalized workspace...</span>
      </div>
    </div>
  )
}
