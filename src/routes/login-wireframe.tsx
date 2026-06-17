import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { LockKeyhole, User, ArrowRight, Package, Info, Eye, EyeOff, Layout, FileText, Settings, Layers, Code, Play } from 'lucide-react'

export const Route = createFileRoute('/login-wireframe')({
  component: LoginWireframePage,
})

function LoginWireframePage() {
  const [wireframeTheme, setWireframeTheme] = useState<'slate' | 'blueprint'>('slate')
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interactionLogs, setInteractionLogs] = useState<string[]>([
    'Wireframe initialized.'
  ])

  const addLog = (message: string) => {
    setInteractionLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev.slice(0, 8)
    ])
  }

  const handleSimulateLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    addLog('Form submission initiated.')
    addLog(`Payload: { username: "${usernameInput}", password: "${'*'.repeat(passwordInput.length)}" }`)
    
    setTimeout(() => {
      setIsSubmitting(false)
      if (usernameInput.trim() === '' || passwordInput.trim() === '') {
        addLog('Validation Failure: Fields cannot be empty.')
      } else {
        addLog('Success: Route transitions to /dashboard.')
      }
    }, 1200)
  }

  const annotations = [
    {
      id: 1,
      title: 'Logo & Header Container',
      description: 'Brand identity containing the main system logo (Package icon) and site branding context (SMK Al Basyariah). Centered layout, vertical orientation.',
      specs: 'Icon: Package (32px) | Logo Text: Bold (24px) | Subtitle: Regular (14px)'
    },
    {
      id: 2,
      title: 'Username Input Field',
      description: 'Focus-managed text field with a leading icon. Auto-focus and tab-index sequence start point. Triggers focus ring state and icon color transition on select.',
      specs: 'Placeholder: "admin" | Height: 48px | Icon: User | Required validation'
    },
    {
      id: 3,
      title: 'Password Input Field',
      description: 'Secure input field featuring a visibility toggle button. Leading Lock icon and trailing Eye/EyeOff toggle buttons.',
      specs: 'Type: password/text toggle | Height: 48px | Icon: LockKeyhole | Toggle type: trigger button'
    },
    {
      id: 4,
      title: 'Forgot Password Assistance Link',
      description: 'Help trigger positioned inline with the password label. Hovering displays a tooltip popover instructing the user to contact the system administrator.',
      specs: 'Action: Tooltip popover on hover | Target: Helpdesk contact'
    },
    {
      id: 5,
      title: 'Submit Login Action',
      description: 'Primary action button with full width. Animates state changes (hover translation, click shrink, spin loader on submit).',
      specs: 'Height: 48px | States: hover, focus, active, disabled | Transition duration: 200ms'
    },
    {
      id: 6,
      title: 'Site Metadata Footer',
      description: 'Monochrome metadata container showing site copyyear dynamically and system build version token.',
      specs: 'Text size: 12px (XS) | Version badge: monospace font'
    }
  ]

  // CSS themes
  const themeClasses = {
    slate: {
      bg: 'bg-slate-50 text-slate-800 border-slate-200',
      grid: 'bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]',
      card: 'bg-white border-2 border-slate-300 shadow-sm',
      cardHeader: 'border-b-2 border-dashed border-slate-300',
      element: 'bg-slate-50 border border-slate-300 text-slate-700',
      input: 'bg-white border border-slate-300 focus:border-slate-800 text-slate-800',
      placeholder: 'placeholder:text-slate-400',
      button: 'bg-slate-800 text-white hover:bg-slate-900 border border-slate-800',
      accent: 'text-slate-900',
      textMuted: 'text-slate-500',
      line: 'border-slate-300',
      annotationBadge: 'bg-slate-800 text-white hover:bg-slate-950',
      activeAnnotationBadge: 'bg-amber-500 text-slate-950 ring-4 ring-amber-200',
      sidebarCard: 'bg-white border border-slate-200 shadow-sm'
    },
    blueprint: {
      bg: 'bg-[#0f172a] text-cyan-100 border-cyan-900',
      grid: 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] [background-size:20px_20px]',
      card: 'bg-[#1e293b]/90 border-2 border-cyan-500/60 shadow-lg shadow-cyan-950/20',
      cardHeader: 'border-b-2 border-dashed border-cyan-500/40',
      element: 'bg-[#0f172a]/60 border border-cyan-500/40 text-cyan-200',
      input: 'bg-[#0f172a] border border-cyan-500/40 focus:border-cyan-400 text-cyan-100',
      placeholder: 'placeholder:text-cyan-700',
      button: 'bg-cyan-600 text-slate-950 hover:bg-cyan-500 border border-cyan-500 font-bold',
      accent: 'text-cyan-400',
      textMuted: 'text-cyan-400/60',
      line: 'border-cyan-500/30',
      annotationBadge: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
      activeAnnotationBadge: 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40',
      sidebarCard: 'bg-[#1e293b]/70 border border-cyan-500/20'
    }
  }

  const currentTheme = themeClasses[wireframeTheme]

  return (
    <div className={`min-h-screen w-full font-mono transition-colors duration-300 ${currentTheme.bg} ${currentTheme.grid} p-4 sm:p-8 flex flex-col`}>
      
      {/* Top Header Controls */}
      <header className={`mb-8 pb-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${currentTheme.line}`}>
        <div>
          <div className="flex items-center gap-2">
            <Layout className={`w-6 h-6 ${currentTheme.accent}`} />
            <h1 className="text-xl font-bold tracking-tight">/login Wireframe Specification</h1>
          </div>
          <p className={`text-xs mt-1 ${currentTheme.textMuted}`}>Interactive Clean-Slate Blueprint for E-Inventaris Login Portal</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex rounded-lg border p-1 ${currentTheme.line} bg-black/5`}>
            <button
              onClick={() => {
                setWireframeTheme('slate')
                addLog('Theme switched to Slate mode.')
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                wireframeTheme === 'slate' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Slate Mode
            </button>
            <button
              onClick={() => {
                setWireframeTheme('blueprint')
                addLog('Theme switched to Blueprint mode.')
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                wireframeTheme === 'blueprint' 
                  ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                  : 'text-cyan-400 hover:text-cyan-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Blueprint
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Wireframe + Technical Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* Left Section: Interactive Wireframe Panel (7 Columns) */}
        <section className="lg:col-span-7 flex flex-col items-center justify-center p-4 min-h-[600px] relative">
          
          <div className={`w-full max-w-md rounded-2xl p-6 sm:p-8 relative transition-all duration-300 ${currentTheme.card}`}>
            
            {/* Corner wireframe crosshairs */}
            <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${currentTheme.line}`} />
            <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${currentTheme.line}`} />
            <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${currentTheme.line}`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${currentTheme.line}`} />

            {/* Wireframe Tag */}
            <div className={`absolute -top-3 left-6 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border rounded bg-inherit ${currentTheme.line} ${currentTheme.textMuted}`}>
              UI Component: LoginCard
            </div>

            {/* Header Element [1] */}
            <div 
              className={`relative flex flex-col items-center text-center pb-6 mb-6 ${currentTheme.cardHeader} cursor-pointer group`}
              onClick={() => setActiveAnnotation(1)}
            >
              {/* Annotation Badge */}
              <button
                onClick={(e) => { e.stopPropagation(); setActiveAnnotation(1); }}
                className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  activeAnnotation === 1 ? currentTheme.activeAnnotationBadge : currentTheme.annotationBadge
                }`}
              >
                1
              </button>

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 border-dashed mb-3 ${currentTheme.line} group-hover:scale-105 transition-transform`}>
                <Package className={`w-8 h-8 ${currentTheme.textMuted}`} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">[ E-Inventaris ]</h2>
              <span className={`text-xs mt-1 border border-dashed px-2 py-0.5 rounded ${currentTheme.line} ${currentTheme.textMuted}`}>
                SMK Al Basyariah
              </span>
            </div>

            {/* Simulated Interactive Form */}
            <form onSubmit={handleSimulateLogin} className="space-y-5">
              
              {/* Username Input [2] */}
              <div 
                className="space-y-1.5 relative cursor-pointer"
                onClick={() => setActiveAnnotation(2)}
              >
                {/* Annotation Badge */}
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveAnnotation(2); }}
                  className={`absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-20 ${
                    activeAnnotation === 2 ? currentTheme.activeAnnotationBadge : currentTheme.annotationBadge
                  }`}
                >
                  2
                </button>

                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Username
                  </label>
                  <span className={`text-[10px] font-mono border border-dashed px-1.5 py-0.2 rounded ${currentTheme.line} ${currentTheme.textMuted}`}>
                    [type: text]
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value)
                      addLog(`Username field input: "${e.target.value}"`)
                    }}
                    placeholder="Enter username (e.g. admin)"
                    className={`w-full h-11 px-3 rounded-lg text-xs font-mono outline-none transition-all ${currentTheme.input} ${currentTheme.placeholder}`}
                  />
                </div>
              </div>

              {/* Password Input [3 & 4] */}
              <div 
                className="space-y-1.5 relative cursor-pointer"
                onClick={() => setActiveAnnotation(3)}
              >
                {/* Annotation Badge for Password Field */}
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveAnnotation(3); }}
                  className={`absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-20 ${
                    activeAnnotation === 3 ? currentTheme.activeAnnotationBadge : currentTheme.annotationBadge
                  }`}
                >
                  3
                </button>

                {/* Annotation Badge for Forgot Password Link */}
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveAnnotation(4); }}
                  className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-20 ${
                    activeAnnotation === 4 ? currentTheme.activeAnnotationBadge : currentTheme.annotationBadge
                  }`}
                >
                  4
                </button>

                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <LockKeyhole className="w-3.5 h-3.5" />
                    Password
                  </label>
                  
                  {/* Tooltip trigger mock link */}
                  <span 
                    className={`text-xs hover:underline decoration-dashed cursor-help font-bold ${currentTheme.accent}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAnnotation(4);
                      addLog('Clicked "Forgot Password" mock link.');
                    }}
                  >
                    Forgot?
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value)
                      addLog(`Password field input value updated. Length: ${e.target.value.length}`)
                    }}
                    placeholder="Enter password"
                    className={`w-full h-11 px-3 pr-10 rounded-lg text-xs font-mono outline-none transition-all ${currentTheme.input} ${currentTheme.placeholder}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                      addLog(`Toggled password visibility: ${!showPassword}`);
                    }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 hover:${currentTheme.accent} transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button [5] */}
              <div className="relative pt-2">
                {/* Annotation Badge */}
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveAnnotation(5); }}
                  className={`absolute top-0 -left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-20 ${
                    activeAnnotation === 5 ? currentTheme.activeAnnotationBadge : currentTheme.annotationBadge
                  }`}
                >
                  5
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-12 rounded-lg text-xs uppercase font-bold tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${currentTheme.button}`}
                >
                  {isSubmitting ? (
                    <span>Executing Request...</span>
                  ) : (
                    <>
                      <span>Execute Authenticate</span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Footer Container [6] */}
            <div 
              className={`mt-6 pt-4 border-t border-dashed flex justify-between items-center text-[10px] ${currentTheme.line} cursor-pointer relative`}
              onClick={() => setActiveAnnotation(6)}
            >
              {/* Annotation Badge */}
              <button
                onClick={(e) => { e.stopPropagation(); setActiveAnnotation(6); }}
                className={`absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-20 ${
                  activeAnnotation === 6 ? currentTheme.activeAnnotationBadge : currentTheme.annotationBadge
                }`}
              >
                6
              </button>

              <span className={currentTheme.textMuted}>&copy; {new Date().getFullYear()} SMK Al Basyariah</span>
              <span className={`px-1.5 py-0.5 border border-dashed rounded ${currentTheme.line} font-mono ${currentTheme.textMuted}`}>
                v1.0.0-wireframe
              </span>
            </div>

          </div>

          {/* Wireframe Legend / Guide */}
          <div className={`mt-6 max-w-sm w-full p-3 rounded-lg border text-[10px] leading-relaxed ${currentTheme.line} bg-black/5 flex gap-2.5`}>
            <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${currentTheme.accent}`} />
            <div>
              <span className="font-bold">Legend:</span> Click on the orange numbered circles to inspect technical blueprints and validation properties in the panel on the right.
            </div>
          </div>
        </section>

        {/* Right Section: Technical Details & Specifications (5 Columns) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Active Specification Detail Card */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 ${currentTheme.sidebarCard}`}>
            <div className="flex items-center gap-2 mb-4">
              <Settings className={`w-5 h-5 ${currentTheme.accent}`} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Specifications</h3>
            </div>

            {activeAnnotation === null ? (
              <div className={`text-xs py-8 text-center ${currentTheme.textMuted}`}>
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Select any annotated section on the wireframe map to view precise engineering metadata.
              </div>
            ) : (
              <div className="space-y-4 animate-[slide-up_0.25s_ease-out]">
                <div className="flex items-center justify-between border-b pb-2 border-dashed border-inherit">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-500 text-slate-950`}>
                      {activeAnnotation}
                    </span>
                    <h4 className="text-xs font-bold">{annotations.find(a => a.id === activeAnnotation)?.title}</h4>
                  </div>
                  <button 
                    onClick={() => setActiveAnnotation(null)}
                    className={`text-[10px] hover:underline ${currentTheme.textMuted}`}
                  >
                    Clear Select
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className={`text-[10px] uppercase font-bold tracking-wider ${currentTheme.textMuted}`}>Functional Description</h5>
                    <p className="text-xs leading-relaxed mt-1">{annotations.find(a => a.id === activeAnnotation)?.description}</p>
                  </div>

                  <div className="p-3 bg-black/10 rounded-lg border border-dashed border-inherit">
                    <h5 className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${currentTheme.accent}`}>
                      <Code className="w-3.5 h-3.5" />
                      Engineering specs
                    </h5>
                    <p className="text-xs font-mono mt-1 text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800 break-words">
                      {annotations.find(a => a.id === activeAnnotation)?.specs}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interaction Simulation Console logs */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 ${currentTheme.sidebarCard}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Play className={`w-5 h-5 ${currentTheme.accent}`} />
                <h3 className="text-sm font-bold uppercase tracking-wider">Console Simulator</h3>
              </div>
              <button
                onClick={() => setInteractionLogs(['Console logs cleared.'])}
                className={`text-[10px] hover:underline ${currentTheme.textMuted}`}
              >
                Clear log
              </button>
            </div>

            <div className="bg-slate-950 text-cyan-400 p-4 rounded-xl font-mono text-[11px] h-48 overflow-y-auto border border-slate-900 space-y-1.5">
              {interactionLogs.map((log, index) => (
                <div key={index} className="truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Verification checklists */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 ${currentTheme.sidebarCard}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className={`w-5 h-5 ${currentTheme.accent}`} />
              Verification Parameters
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <input type="checkbox" defaultChecked disabled className="mt-0.5" />
                <span>Responsive Viewports: standard web, tablet, mobile layouts</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" defaultChecked disabled className="mt-0.5" />
                <span>Input State Transitions: focus, typing feedback, validation</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" defaultChecked disabled className="mt-0.5" />
                <span>Security features: toggle switch mask for credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" defaultChecked disabled className="mt-0.5" />
                <span>Loading animations & disabled submit state protection</span>
              </li>
            </ul>
          </div>

        </section>

      </div>

      {/* Global wireframe site navigation footer */}
      <footer className={`mt-auto pt-6 border-t flex flex-col sm:flex-row justify-between items-center text-xs ${currentTheme.line} ${currentTheme.textMuted} gap-4`}>
        <div>
          <span>Route context: </span>
          <code className={`px-1 rounded bg-black/10 ${currentTheme.accent}`}>src/routes/login-wireframe.tsx</code>
        </div>
        <div className="flex gap-4">
          <a href="/login" className={`hover:underline font-bold ${currentTheme.accent}`}>View Live Login Page &rarr;</a>
        </div>
      </footer>
    </div>
  )
}
