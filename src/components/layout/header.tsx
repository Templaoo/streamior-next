import { ModeToggle } from "@/components/ui/mode-toggle"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { NavigationWithLoading } from "@/components/layout/navigation-with-loading"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-bold">S</span>
          </div>
          <span className="text-lg font-semibold">Streamior Pro</span>
        </div>
        
        {/* Navigation */}
        <NavigationWithLoading className="hidden md:flex" />
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}