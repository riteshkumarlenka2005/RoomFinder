"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Home, Users, Building, Utensils, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CompleteProfilePage() {
  const router = useRouter()
  const [userType, setUserType] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/login")
      } else if (data.user.user_metadata?.role) {
        // If they already have a role, they shouldn't be here
        router.push("/search")
      } else {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  const userTypes = [
    {
      id: "student",
      title: "Student",
      description: "Looking for rooms and accommodation",
      icon: Users,
      color: "blue",
    },
    {
      id: "owner",
      title: "Property Owner",
      description: "Want to list your property",
      icon: Building,
      color: "green",
    },
    {
      id: "maushi",
      title: "Domestic helper",
      description: "Provide cooking services",
      icon: Utensils,
      color: "purple",
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { role: userType }
      })

      if (error) {
        throw error
      }

      alert("Profile completed successfully!")
      router.push("/search")
    } catch (error: any) {
      console.error("Error updating profile:", error.message)
      alert(error.message)
      setIsLoading(false)
    }
  }

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-4">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Profile</h1>
          <p className="text-gray-600">Please select your role to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Role</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <Label className="text-base font-medium">I am a:</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {userTypes.map((type) => (
                    <div key={type.id}>
                      <input
                        type="radio"
                        id={type.id}
                        name="userType"
                        value={type.id}
                        checked={userType === type.id}
                        onChange={(e) => setUserType(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={type.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          userType === type.id
                            ? `border-${type.color}-500 bg-${type.color}-50`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <type.icon
                          className={`w-5 h-5 mr-3 ${
                            userType === type.id ? `text-${type.color}-600` : "text-gray-400"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{type.title}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                        {userType === type.id && (
                          <CheckCircle className={`w-5 h-5 ml-auto text-${type.color}-600`} />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Continue to RoomFinder"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
