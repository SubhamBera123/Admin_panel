import { Bell, Search, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/useTheme';

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-card border-b border-border/50 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hover-scale" />
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products, orders, customers..."
            className="pl-10 glass bg-input/50 border-border/50 focus:bg-input/80 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hover-scale hover:bg-accent/50 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
          <span className="ml-2 text-sm font-medium">
            {theme === 'light' ? 'Dark' : 'Light'}
          </span>
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative hover-scale hover:bg-accent/50 transition-colors duration-200"
        >
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
            3
          </Badge>
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@store.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}