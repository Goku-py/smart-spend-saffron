import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className, 
  size = 'default', 
  variant = 'ghost',
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`theme-toggle-button transition-all duration-300 hover:scale-105 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
      role="switch"
      title={`Currently in ${theme} mode. Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode.`}
    >
      <div className="relative flex items-center">
        {theme === 'light' ? (
          <Moon className="h-4 w-4 transition-transform duration-300 rotate-0" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-300 rotate-180" />
        )}
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            {theme === 'light' ? 'Dark' : 'Light'}
          </span>
        )}
      </div>
      <span className="sr-only">
        {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </Button>
  );
};

export default ThemeToggle;