import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/store/auth'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  
  const { signIn, signInWithGoogle, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address.')
      return
    }
    
    if (isSignUp && !name) {
      toast.error('Please enter your name.')
      return
    }
    
    try {
      const displayName = isSignUp ? name : email.split('@')[0]
      await signIn(email, displayName)
      toast.success(`Welcome back, ${displayName}!`)
      onClose()
      // Reset form states
      setEmail('')
      setName('')
    } catch (err) {
      toast.error('An error occurred during sign in. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success('Successfully signed in with Google!')
      onClose()
    } catch (err) {
      toast.error('Google Sign In was cancelled or failed.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[400px] p-8 rounded-lg bg-white border border-[#e5e5e5] shadow-2xl">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="font-body text-2xl font-bold tracking-tight text-[#1a1a1a]">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-[#7a7a7a]">
            {isSignUp 
              ? 'Join May Bay Lo to track orders and save your favourites.' 
              : 'Sign in to access your account, orders and wishlist.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-[44px] border-[#dadce0] focus:border-[#1a1a1a] rounded-sm text-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="font-body text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-[44px] border-[#dadce0] focus:border-[#1a1a1a] rounded-sm text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] bg-[#1c1c1c] hover:bg-[#2d2d2d] text-white font-body font-bold text-xs uppercase tracking-widest rounded-sm transition-all"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#e5e5e5]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 font-body text-[#7a7a7a] tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-in Branded Button */}
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full h-[46px] border border-[#dadce0] hover:bg-[#f8fafd] text-[#3c4043] hover:text-[#202124] hover:border-[#c2e7ff] font-body font-medium text-sm flex items-center justify-center gap-3 rounded-sm transition-all"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.61 -0.05,-1.2 -0.15,-1.78Z" fill="#4285F4" />
            <path d="M12,20.6c2.59,0 4.77,-0.86 6.36,-2.33l-3.3,-2.57c-0.91,0.61 -2.08,0.98 -3.06,0.98c-2.48,0 -4.59,-1.67 -5.34,-3.93h-3.41v2.64c1.58,3.14 4.82,5.21 8.75,5.21Z" fill="#34A853" />
            <path d="M6.66,12.78c-0.19,-0.57 -0.3,-1.18 -0.3,-1.78s0.11,-1.21 0.3,-1.78V6.58H3.25c-0.66,1.32 -1.03,2.8 -1.03,4.42s0.37,3.1 1.03,4.42l3.41,-2.64Z" fill="#FBBC05" />
            <path d="M12,5.74c1.41,0 2.68,0.49 3.68,1.44l2.76,-2.76c-1.66,-1.55 -3.82,-2.5 -6.44,-2.5c-3.93,0 -7.17,2.07 -8.75,5.21l3.41,2.64c0.75,-2.26 2.86,-3.93 5.34,-3.93Z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </Button>

        <div className="text-center mt-6 font-body text-xs text-[#7a7a7a]">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-[#1a1a1a] hover:underline font-semibold"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-[#1a1a1a] hover:underline font-semibold"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
