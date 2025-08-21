import { Button } from '@v1/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useThemeContext } from './theme-provider'

export function ThemeToggle() {
  const { toggleTheme, isDark } = useThemeContext()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
