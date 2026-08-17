import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="gap-2">
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}