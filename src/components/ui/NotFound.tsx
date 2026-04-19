import { Link } from '@tanstack/react-router'
import { ArrowLeft, Home } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative background blur elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl flex justify-center opacity-30 pointer-events-none blur-3xl">
        <div className="w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply animate-blob"></div>
        <div className="w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply animate-blob animation-delay-2000 -ml-16"></div>
        <div className="w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply animate-blob animation-delay-4000 -ml-16 -mt-16"></div>
      </div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 p-8 md:p-12 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-indigo-600 tracking-tighter drop-shadow-sm transition-transform hover:scale-105 duration-500 cursor-default">
            404
          </h1>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Oops! Tersesat?
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
            Halaman yang Anda cari mungkin telah dipindahkan, diganti namanya, atau memang tidak pernah ada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2 group ring-1 ring-transparent hover:ring-slate-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
          
          <Link 
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:from-primary-700 hover:to-primary-600 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
