"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getDashboardUrl, getUserRole } from "@/lib/roles"
import { Loader2, Home } from "lucide-react"

export default function DashboardDispatcher() {
  const router = useRouter()

  useEffect(() => {
    async function routeToDashboard() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData?.session?.user

        if (!user) {
          router.replace("/login?redirect=/dashboard")
          return
        }

        const targetUrl = getDashboardUrl(user)
        router.replace(targetUrl)
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
      <h2 className="text-xl font-bold text-gray-900 mb-2">Opening Your Dashboard...</h2>
      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  )
}
