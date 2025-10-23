import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Shield,
  Building2,
  Ticket,
  Wrench,
  Users,
  CreditCard,
  TrendingUp,
  BarChart3,
  FileCheck,
  Plug,
  Globe,
  Settings,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from './ui/utils';
import { UserRole } from '../types';
import { hasAccess, getAccessDeniedReason, ModuleName } from '../lib/rbac';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Button } from './ui/button';
import { useLocale } from '../contexts/LocaleContext';

interface NavItem {
  id: ModuleName;
  icon: React.ComponentType<{ className?: string }>;
}

interface LeftNavProps {
  currentView: string;
  userRole: UserRole;
  onNavigate: (view: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function LeftNav({
  currentView,
  userRole,
  onNavigate,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: LeftNavProps) {
  const { t } = useLocale();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  const navItems: NavItem[] = [
    { id: 'overview', icon: LayoutDashboard },
    { id: 'auth', icon: Shield },
    { id: 'tenants', icon: Building2 },
    { id: 'tickets', icon: Ticket },
    { id: 'technicians', icon: Wrench },
    { id: 'crm', icon: Users },
    { id: 'billing', icon: CreditCard },
    { id: 'revenue', icon: TrendingUp },
    { id: 'reports', icon: BarChart3 },
    { id: 'compliance', icon: FileCheck },
    { id: 'integrations', icon: Plug },
    { id: 'portal', icon: Globe },
    { id: 'settings', icon: Settings },
  ];
  
  // Use controlled or internal state
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setCollapsed = onCollapsedChange || setInternalCollapsed;

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280 && !collapsed) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, setCollapsed]);

  return (
    <div
      className={cn(
        'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-180',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      <div className="flex-1 py-4 overflow-y-auto">
        <TooltipProvider>
          <nav className={cn('space-y-1', collapsed ? 'px-2' : 'px-3')}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const canAccess = hasAccess(userRole, item.id);
              const deniedReason = canAccess ? '' : getAccessDeniedReason(userRole, item.id);

              const navButton = (
                <button
                  key={item.id}
                  onClick={() => canAccess && onNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center rounded-lg transition-all duration-200 relative',
                    collapsed ? 'gap-0 px-3 py-2.5 justify-center' : 'gap-3 px-3 py-2.5',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
                    !canAccess && 'opacity-50 cursor-not-allowed',
                    isActive && collapsed && 'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:rounded-r-full before:bg-primary'
                  )}
                  disabled={!canAccess}
                >
                  <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                  {!collapsed && (
                    <>
                      <span className="truncate">{t.nav[item.id as keyof typeof t.nav]}</span>
                      {!canAccess && <Lock className="h-3 w-3 ml-auto shrink-0" />}
                    </>
                  )}
                </button>
              );

              if (collapsed || !canAccess) {
                return (
                  <Tooltip key={item.id} delayDuration={collapsed ? 200 : 0}>
                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px]">
                      {collapsed ? (
                        <p className="text-sm">{t.nav[item.id as keyof typeof t.nav]}</p>
                      ) : (
                        <p className="text-sm">{deniedReason}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navButton;
            })}
          </nav>
        </TooltipProvider>
      </div>
      
      {/* Footer with collapse toggle */}
      <div className="border-t border-sidebar-border">
        {!collapsed && (
          <div className="p-4">
            <div className="text-xs text-muted-foreground">Current Role</div>
            <div className="text-sm font-medium mt-1">{t.roles[userRole as keyof typeof t.roles]}</div>
          </div>
        )}
        <div className={cn('flex items-center justify-center p-2', collapsed && 'border-t border-sidebar-border')}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
