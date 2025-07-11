import * as z from "zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
})

type SignUpFormData = z.infer<typeof signUpSchema>

interface SignUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignIn: () => void
}

const calculatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) score += 20
  else feedback.push("At least 8 characters")

  if (/[A-Z]/.test(password)) score += 20
  else feedback.push("One uppercase letter")

  if (/[a-z]/.test(password)) score += 20
  else feedback.push("One lowercase letter")

  if (/[0-9]/.test(password)) score += 20
  else feedback.push("One number")

  if (/[^A-Za-z0-9]/.test(password)) score += 20
  else feedback.push("One special character")

  return { score, feedback }
}

export function SignUpModal({ open, onOpenChange, onSwitchToSignIn }: SignUpModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      terms: false,
    },
  })

  const watchedPassword = watch("password", "")
  const termsAccepted = watch("terms")

  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(calculatePasswordStrength(watchedPassword))
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [watchedPassword])

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Sign up data:", data)
      setIsSuccess(true)

      setTimeout(() => {
        reset()
        setIsSuccess(false)
        onOpenChange(false)
      }, 3000)
    } catch (error) {
      console.error("Sign up error:", error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset()
      setIsSuccess(false)
      setPasswordStrength({ score: 0, feedback: [] })
    }
    onOpenChange(newOpen)
  }

  const getStrengthColor = (score: number) => {
    if (score < 40) return "bg-red-500"
    if (score < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = (score: number) => {
    if (score < 40) return "Weak"
    if (score < 80) return "Medium"
    return "Strong"
  }

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-purple-800/30" aria-describedby="success-description">
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="h-16 w-16 text-purple-400 mx-auto" />
            <DialogTitle className="text-2xl font-bold text-purple-400">Account Created Successfully!</DialogTitle>
            <p id="success-description" className="text-gray-300">
              Welcome aboard! Your account has been created and you can now start using our platform.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 border-purple-800/30 text-gray-200"
        aria-describedby="signup-description"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Create Account</DialogTitle>
          </div>
          <DialogDescription id="signup-description" className="text-gray-300">
            Enter your information to create a new account and join our community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-sm font-medium text-gray-200">
              Full Name
            </Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={`bg-gray-800 border-purple-800/30 text-white placeholder:text-gray-400 focus:border-purple-500 ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm font-medium text-gray-200">
              Email Address
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className={errors.email ? "border-red-500 focus:border-red-500" : ""}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm font-medium text-gray-200">
              Password
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register("password")}
                className={errors.password ? "border-red-500 focus:border-red-500 pr-10" : "pr-10"}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-requirements password-strength"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {watchedPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Password Strength:</span>
                  <span
                    className={`font-medium ${passwordStrength.score < 40 ? "text-red-500" : passwordStrength.score < 80 ? "text-yellow-500" : "text-green-500"}`}
                  >
                    {getStrengthText(passwordStrength.score)}
                  </span>
                </div>
                <Progress
                  value={passwordStrength.score}
                  className="h-2"
                  aria-label={`Password strength: ${getStrengthText(passwordStrength.score)}`}
                />
                <div
                  className={`h-2 rounded-full ${getStrengthColor(passwordStrength.score)}`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
                {passwordStrength.feedback.length > 0 && (
                  <div id="password-requirements" className="text-xs text-gray-600">
                    <p>Missing requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="signup-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setValue("terms", checked as boolean)}
                aria-describedby="terms-error"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="signup-terms" className="text-sm font-normal cursor-pointer text-gray-200">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => alert("Terms and Conditions would open here")}
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => alert("Privacy Policy would open here")}
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>
            </div>
            {errors.terms && (
              <p id="terms-error" className="text-sm text-red-500 flex items-center gap-1 ml-6">
                <AlertCircle className="h-4 w-4" />
                {errors.terms.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-purple-400 hover:text-purple-300 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
            >
              Sign in here
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
