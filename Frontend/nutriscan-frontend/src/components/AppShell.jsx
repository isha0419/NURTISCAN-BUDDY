import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ScanLine,
  Sparkles,
  History,
  LogOut,
  Leaf,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/cravings', label: 'Cravings', icon: Sparkles },
  { to: '/history', label: 'History', icon: History },
];

function NavItem({ to, label, icon: Icon, mobile }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
          mobile && 'flex-col gap-1 rounded-none px-0 py-1.5 text-[11px]',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !mobile && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-xl bg-primary/10"
              transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
            />
          )}
          <Icon size={mobile ? 20 : 18} className="relative z-10 shrink-0" />
          <span className="relative z-10">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 glass">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Leaf size={18} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              NutriScan <span className="text-primary">Buddy</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-foreground/80">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 py-6">
        {/* Desktop sidebar */}
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 md:block">
          <nav className="glass-card flex flex-col gap-1 p-3">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </aside>

        {/* Page content */}
        <main className="min-w-0 flex-1 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="glass fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} mobile />
          ))}
        </div>
      </nav>
    </div>
  );
}
