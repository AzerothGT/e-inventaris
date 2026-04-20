import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LockKeyhole, User, ArrowRight, Package, Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { loginUser } from '../server/functions/auth'
import { toast } from 'sonner'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await loginUser({ data: { username, password } })
      if (result.success) {
        toast.success(`Selamat datang kembali, ${result.user.name}!`)
        navigate({ to: '/dashboard' })
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal masuk. Silakan periksa kembali username dan password Anda.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-surface-50 flex items-center justify-center p-4 relative overflow-hidden page-enter">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-600/10 blur-[120px] mix-blend-multiply animate-[blob_7s_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-multiply animate-[blob_7s_infinite] [animation-delay:2s]" />
      <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-sky-600/10 blur-[100px] mix-blend-multiply animate-[blob_7s_infinite] [animation-delay:4s]" />
      
      <div className="relative w-full max-w-md z-10">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-card-hover border border-surface-200 p-8 sm:p-10 transition-all duration-300 hover:shadow-modal relative overflow-hidden">
          
          {/* Decorative shine effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20 rotate-3 transition-transform duration-300 hover:rotate-6 hover:scale-105 border border-primary-500/50">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600">
                E-Inventaris
              </h1>
              <p className="text-surface-500 mt-2 text-sm sm:text-base">
                SMK Al Basyariah
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5 group">
                <label className="text-sm font-medium text-surface-700 group-focus-within:text-primary-600 transition-colors" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                    <User className="h-5 w-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-surface-200 bg-white/50 px-3 pl-11 py-2 text-sm text-surface-900 ring-offset-white placeholder:text-surface-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm focus:bg-white"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-surface-700 group-focus-within:text-primary-600 transition-colors" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group/forgot">
                    <span className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-all cursor-help border-b border-dashed border-transparent hover:border-primary-500 pb-0.5">
                      Lupa password?
                    </span>
                    <div className="absolute bottom-full right-0 mb-1.5 px-3 py-1.5 bg-surface-800 text-white text-xs font-normal rounded-lg opacity-0 group-hover/forgot:opacity-100 transition-all duration-200 pointer-events-none translate-y-1 group-hover/forgot:translate-y-0 shadow-lg whitespace-nowrap z-20">
                      Hubungi admin
                      <div className="absolute top-full right-6 w-0 h-0 border-[5px] border-transparent border-t-surface-800" />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
                    <LockKeyhole className="h-5 w-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-surface-200 bg-white/50 px-3 pl-11 pr-11 py-2 text-sm text-surface-900 ring-offset-white placeholder:text-surface-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-primary-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center h-12 mt-2 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary-600/20 overflow-hidden"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Masuk ke Sistem</span>
                  <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                </>
              )}
            </button>
          </form>

          {/* Footer details */}
          <div className="mt-8 pt-6 border-t border-surface-100 flex flex-col sm:flex-row justify-between items-center text-xs text-surface-500 gap-2 sm:gap-4 text-center sm:text-left">
            <p className="font-medium">
              &copy; {new Date().getFullYear()} SMK Al Basyariah
            </p>
            <p className="px-2 py-1 bg-surface-100 rounded-md font-mono text-[10px]">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
