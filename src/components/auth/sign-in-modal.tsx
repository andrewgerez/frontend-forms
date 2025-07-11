import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff, CheckCircle, X, AlertCircle, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignUp: () => void
}

export function SignInModal({ open, onOpenChange, onSwitchToSignUp }: SignInModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (data: SignInFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Sign in data:", data)
      setIsSuccess(true)

      setTimeout(() => {
        reset()
        setIsSuccess(false)
        onOpenChange(false)
      }, 2500)
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  const handleForgotPassword = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(`Password reset link sent to ${email}`)
    setShowForgotPassword(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset()
      setIsSuccess(false)
      setShowForgotPassword(false)
    }
    onOpenChange(newOpen)
  }

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md bg-gray-900 border-purple-800/30"
          aria-describedby="signin-success-description"
        >
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="h-16 w-16 text-purple-400 mx-auto" />
            <DialogTitle className="text-2xl font-bold text-purple-400">Welcome Back!</DialogTitle>
            <p id="signin-success-description" className="text-gray-300">
              You have successfully signed in. Redirecting to your dashboard...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (showForgotPassword) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md bg-gray-900 border-purple-800/30"
          aria-describedby="forgot-password-description"
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white">Reset Password</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForgotPassword(false)}
                aria-label="Go back to sign in"
                className="text-gray-400 hover:text-white hover:bg-purple-800/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription id="forgot-password-description" className="text-gray-300">
              Enter your email address and we'll send you a link to reset your password
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const email = formData.get("reset-email") as string
              handleForgotPassword(email)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input id="reset-email" name="reset-email" type="email" placeholder="Enter your email address" required />
            </div>

            <Button type="submit" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgotPassword(false)}>
              Back to Sign In
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-purple-800/30 text-gray-200" aria-describedby="signin-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Sign In</DialogTitle>
          </div>
          <DialogDescription id="signin-description" className="text-gray-300">
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="signin-email" className="text-sm font-medium text-gray-200">
              Email Address
            </Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className={`bg-gray-800 border-purple-800/30 text-white placeholder:text-gray-400 focus:border-purple-500 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "signin-email-error" : undefined}
            />
            {errors.email && (
              <p id="signin-email-error" className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signin-password" className="text-sm font-medium text-gray-200">
              Password
            </Label>
            <div className="relative">
              <Input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500 focus:border-red-500 pr-10" : "pr-10"}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "signin-password-error" : undefined}
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
            {errors.password && (
              <p id="signin-password-error" className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                className="border-purple-800/30 data-[state=checked]:bg-purple-600"
              />
              <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer text-gray-300">
                Remember me
              </Label>
            </div>

            <button
              type="button"
              className="text-sm text-purple-400 hover:text-purple-300 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-purple-400 hover:text-purple-300 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
            >
              Create one here
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
