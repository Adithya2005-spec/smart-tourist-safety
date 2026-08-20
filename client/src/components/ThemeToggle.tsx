import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "outline" | "ghost" | "default";
  showLabel?: boolean;
}

export function ThemeToggle({ className, variant = "outline", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant={variant}
      size={showLabel ? "sm" : "icon"}
      onClick={toggleTheme}
      className={cn(
        "relative rounded-xl transition-all duration-300",
        isDark
          ? "border-slate-700 bg-slate-800/80 text-amber-300 hover:bg-slate-700 hover:text-amber-200"
          : "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100 text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100 text-cyan-600" />
        )}
        {showLabel && (
          <span className="text-xs font-semibold">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
        )}
      </div>
    </Button>
  );
}
