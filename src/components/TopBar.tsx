import { Bell, HelpCircle, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocale } from '../contexts/LocaleContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TopBarProps {
  currentTenant: string;
  currentRole: string;
  dateRange: string;
  theme: 'light' | 'dark';
  userName: string;
  onTenantChange: (tenant: string) => void;
  onDateRangeChange: (range: string) => void;
  onRoleChange: (role: string) => void;
  onThemeToggle: () => void;
  onLogout: () => void;
}

export function TopBar({
  currentTenant,
  currentRole,
  dateRange,
  theme,
  userName,
  onTenantChange,
  onDateRangeChange,
  onRoleChange,
  onThemeToggle,
  onLogout,
}: TopBarProps) {
  const { t } = useLocale();
  
  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-foreground">ISP Manager</h1>
        
        <Select value={currentTenant} onValueChange={onTenantChange}>
          <SelectTrigger className="w-[200px] bg-input-background border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FiberFast ISP">FiberFast ISP</SelectItem>
            <SelectItem value="SkyLine Net">SkyLine Net</SelectItem>
            <SelectItem value="BayLink Broadband">BayLink Broadband</SelectItem>
            <SelectItem value="MetroFiber">MetroFiber</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[140px] bg-input-background border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="bg-muted">
          Production
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="w-[280px] h-9 px-3 rounded-lg bg-input-background border-0 placeholder:text-muted-foreground"
          />
        </div>

        <Select value={currentRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[160px] bg-input-background border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SuperAdmin">Super Admin</SelectItem>
            <SelectItem value="SystemAdmin">System Admin</SelectItem>
            <SelectItem value="Technician">Technician</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={onThemeToggle} title={t.topBar.toggleTheme}>
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        <LanguageSwitcher />

        <Button variant="ghost" size="icon" className="relative" title={t.topBar.notifications}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 border-l border-border h-auto py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="leading-none text-foreground">{userName}</span>
                <span className="text-muted-foreground leading-none text-xs">{currentRole}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{currentRole}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
