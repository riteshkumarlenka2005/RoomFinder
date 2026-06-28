"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"

import { Home, User, Mail, Phone, Lock, Eye, EyeOff, Users, Building, Utensils, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.")
    setIsLoading(false)
    return
  }

  if (!formData.email || !formData.password) {
    alert("Please fill email and password.")
    setIsLoading(false)
    return
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          role: formData.userType,   // ✅ student | owner | maushi
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
      },
    })

    if (error) throw error

    alert("Account created! Please check your email and confirm your account.")

    // ✅ After email verification user will login normally
    window.location.href = "/login"
  } catch (err: any) {
    console.error("Sign up error:", err)
    alert(err.message || "Failed to create account.")
  } finally {
    setIsLoading(false)
  }
}

const handleGoogleLogin = async () => {
  setIsLoading(true);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    alert(error.message);
    setIsLoading(false);
  }
};


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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-4">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join thousands of students and property owners</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
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
                        checked={formData.userType === type.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor={type.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.userType === type.id
                            ? `border-${type.color}-500 bg-${type.color}-50`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <type.icon
                          className={`w-5 h-5 mr-3 ${
                            formData.userType === type.id ? `text-${type.color}-600` : "text-gray-400"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{type.title}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                        {formData.userType === type.id && (
                          <CheckCircle className={`w-5 h-5 ml-auto text-${type.color}-600`} />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked:boolean) => setFormData((prev) => ({ ...prev, agreeToTerms: checked }))}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={!formData.agreeToTerms || isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-6"
              size="lg"
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </Button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Join RoomFinder and get:</p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Access to verified room listings</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Direct contact with property owners</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Maushi service connections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
