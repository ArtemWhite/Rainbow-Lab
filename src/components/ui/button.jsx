import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-button-cap uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        ghost: 'border border-white bg-transparent text-white hover:bg-white hover:text-black rounded-pill',
        outline: 'border border-hairline-dark bg-transparent hover:bg-canvas-night-soft rounded-pill',
        default: 'bg-white text-black hover:bg-white/90 rounded-pill',
      },
      size: {
        default: 'px-xl py-lg',
        sm: 'px-md py-sm text-xs',
        lg: 'px-xxl py-lg text-base',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
