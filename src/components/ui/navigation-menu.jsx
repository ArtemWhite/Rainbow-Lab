import * as React from 'react'
import { cn } from '@/lib/utils'
import { Root, List, Item, Link } from '@radix-ui/react-navigation-menu'

const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn('relative z-10 flex flex-1 items-center justify-between', className)}
    {...props}
  >
    {children}
  </Root>
))
NavigationMenu.displayName = 'NavigationMenu'

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <List
    ref={ref}
    className={cn('flex items-center gap-xxl list-none', className)}
    {...props}
  />
))
NavigationMenuList.displayName = 'NavigationMenuList'

const NavigationMenuItem = React.forwardRef((props, ref) => (
  <Item ref={ref} {...props} />
))
NavigationMenuItem.displayName = 'NavigationMenuItem'

function NavigationMenuLink({ className, href, children, ...props }) {
  return (
    <Link
      className={cn(
        'text-micro-cap uppercase tracking-[0.96px] text-on-primary no-underline hover:opacity-70 transition-opacity cursor-pointer',
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  )
}

export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink }
