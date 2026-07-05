import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none'
    const variants = {
      default: 'bg-navy text-white hover:bg-navy-light',
      ghost: 'hover:bg-gray-100 text-gray-700',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(base, variants[variant], className, (children as React.ReactElement<{ className?: string }>).props.className),
      })
    }

    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
