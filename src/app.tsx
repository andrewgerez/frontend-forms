import './globals.css'
import { useState } from 'react'
import { Button } from './components/ui/button'
import { SignInModal } from './components/auth/sign-in-modal'
import { SignUpModal } from './components/auth/sign-up-modal'
import { LogIn, Shield, UserPlus, Users, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

function App() {
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-black">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Frontend Test</span>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Frontend Developer Position
              <span className="text-purple-400"> Technical Assessment</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Authentication system assessment using React, TypeScript, and form handling skills.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setSignUpOpen(true)}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-3 text-lg border-purple-400 text-purple-400 hover:bg-purple-800/20 hover:text-purple-300 bg-transparent"
              onClick={() => setSignInOpen(true)}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="border-purple-800/30 shadow-lg bg-gray-800/50 backdrop-blur">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white">React & TypeScript</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-300">
                  Proficiency with modern React patterns, Hooks, and TypeScript implementation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-purple-800/30 shadow-lg bg-gray-800/50 backdrop-blur">
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white">Form Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-300">
                  React Hook Form, Zod validation, and user experience best practices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-purple-800/30 shadow-lg bg-gray-800/50 backdrop-blur">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-white">UI/UX Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-300">
                  Responsive, accessible, and visually appealing user interfaces.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SignUpModal
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
        onSwitchToSignIn={() => {
          setSignUpOpen(false)
          setSignInOpen(true)
        }}
      />

      <SignInModal
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSwitchToSignUp={() => {
          setSignInOpen(false)
          setSignUpOpen(true)
        }}
      />
    </div>
  )
}

export default App
