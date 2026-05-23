import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center text-micro-cap uppercase tracking-[0.96px] text-on-primary-mute',
  {
    variants: {
      variant: {
        default: '',
        outline: 'border border-hairline-dark px-lg py-xxs rounded-pill',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
