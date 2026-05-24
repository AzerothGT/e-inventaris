import * as React from "react"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Dialog({ isOpen, onClose, title, children, className, size = 'md' }: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  }

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else {
      dialog.close()
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect()
    if (
      dialogDimensions &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={cn(
        "modal-container fixed inset-0 m-auto p-0 border-none bg-transparent outline-none backdrop:bg-surface-950/40 backdrop:backdrop-blur-sm",
        className
      )}
    >
      <div className={cn(
        "bg-white rounded-2xl shadow-2xl w-full mx-auto overflow-hidden animate-in fade-in zoom-in duration-300",
        sizeClasses[size]
      )}>
        <div className="flex items-center justify-between p-6 border-b border-surface-100">
          {title && <h3 className="text-xl font-bold text-surface-900">{title}</h3>}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isOpen && children}
        </div>
      </div>
    </dialog>
  )
}
