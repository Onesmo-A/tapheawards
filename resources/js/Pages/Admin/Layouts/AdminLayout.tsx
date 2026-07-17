import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ShieldCheck, LogOut, TrendingUp, Menu,
  FolderOpen, Award, Users, FileSpreadsheet, Database, Settings,
  Calendar, CreditCard, ShieldAlert, BarChart2, Trophy, Film, Activity,
  ReceiptText, ClipboardList, Building
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type MenuKey = 'voting' | 'finance' | 'registry' | null;
type AdminRole = 'super_admin' | 'auditor' | 'content_manager';

interface SubItem {
  to: string;
  label: string;
  Icon: React.ElementType;
  roles?: AdminRole[];
}

interface NavGroup {
  key: MenuKey;
  label: string;
  Icon: React.ElementType;
  children: SubItem[];
}

interface NavItem {
  to: string;
  label: string;
  Icon: React.ElementType;
  roles?: AdminRole[];
}

// ─────────────────────────────────────────────
// Menu tree definition
// ─────────────────────────────────────────────
const TOP_ITEMS: NavItem[] = [
  { to: '/admin/dashboard', label: 'Overview', Icon: BarChart2 },
];

const NAV_GROUPS: NavGroup[] = [
  {
    key: 'voting',
    label: 'Awards & Votes',
    Icon: Award,
    children: [
      { to: '/admin/categories', label: 'Categories', Icon: FolderOpen, roles: ['super_admin'] },
      { to: '/admin/nominees',   label: 'Nominees',   Icon: Users, roles: ['super_admin'] },
      { to: '/admin/applications', label: 'Applications', Icon: ClipboardList, roles: ['super_admin'] },
      { to: '/admin/vote-packages', label: 'Vote Packages', Icon: ReceiptText, roles: ['super_admin'] },
      { to: '/admin/votes',      label: 'Votes Desk', Icon: Database },
      { to: '/admin/standings',  label: 'Standings',  Icon: TrendingUp },
      { to: '/admin/winners',    label: 'Winners',    Icon: Trophy, roles: ['super_admin'] },
      { to: '/admin/export',     label: 'Export',     Icon: FileSpreadsheet, roles: ['super_admin', 'auditor'] },
    ],
  },
  {
    key: 'registry',
    label: 'Registries',
    Icon: Calendar,
    children: [
      { to: '/admin/marathon', label: 'Marathon',     Icon: Activity },
      { to: '/admin/tickets',  label: 'Gala Tickets', Icon: CreditCard },
      { to: '/admin/sponsorships', label: 'Sponsorships', Icon: Building, roles: ['super_admin'] },
    ],
  },
  {
    key: 'finance',
    label: 'Finance & Flow',
    Icon: ReceiptText,
    children: [
      { to: '/admin/applications', label: 'Nominations', Icon: ClipboardList, roles: ['super_admin', 'auditor'] },
      { to: '/admin/payments', label: 'Payments', Icon: CreditCard, roles: ['super_admin', 'auditor'] },
      { to: '/admin/process-logs', label: 'Process Logs', Icon: ClipboardList, roles: ['super_admin', 'auditor'] },
      { to: '/admin/security', label: 'Security Audit', Icon: ShieldAlert, roles: ['super_admin', 'auditor'] },
    ],
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  { to: '/admin/activity', label: 'Activity Queue', Icon: ShieldAlert },
  { to: '/admin/content',  label: 'Content Manager', Icon: Film, roles: ['super_admin', 'content_manager'] },
  { to: '/admin/settings', label: 'Settings',         Icon: Settings, roles: ['super_admin'] },
];

// Route ➜ page title map
const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':  'System Overview',
  '/admin/categories': 'Categories Grid',
  '/admin/nominees':   'Nominees Directory',
  '/admin/applications': 'Nominee Applications',
  '/admin/vote-packages': 'Manage Vote Packages',
  '/admin/votes':      'Nominees & Votes Desk',
  '/admin/standings':  'Live Vote Standings',
  '/admin/winners':    'Winners Announcement Desk',
  '/admin/marathon':   'Marathon Registrants',
  '/admin/tickets':    'Ticket Purchases Registry',
  '/admin/sponsorships': 'Sponsorship Inquiries',
  '/admin/activity':   'Activity & Review Queues',
  '/admin/payments':   'Payments Monitor',
  '/admin/process-logs': 'Process Logs',
  '/admin/security':   'Security Audit Center',
  '/admin/content':    'Content Manager',
  '/admin/settings':   'System Settings',
  '/admin/export':     'Export Center',
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // true = fully open (w-64), false = icon-only rail (w-[68px]) on desktop; hidden on mobile
  const [expanded,    setExpanded]    = useState<boolean>(window.innerWidth >= 768);
  const [mobileOpen,  setMobileOpen]  = useState<boolean>(false);
  const [openGroup,   setOpenGroup]   = useState<MenuKey>(null);
  const [, setHoveredGroup] = useState<MenuKey>(null);

  // Auth
  const adminToken = localStorage.getItem('admin_token');
  const adminUser  = JSON.parse(localStorage.getItem('admin_user') || '{}');
  const adminRole = (adminUser.role || 'auditor') as AdminRole;
  const canAccess = (roles?: AdminRole[]) => !roles || roles.includes(adminRole);
  const visibleTopItems = TOP_ITEMS.filter(item => canAccess(item.roles));
  const visibleNavGroups = NAV_GROUPS.map(group => ({
    ...group,
    children: group.children.filter(child => canAccess(child.roles)),
  })).filter(group => group.children.length > 0);
  const visibleBottomItems = BOTTOM_ITEMS.filter(item => canAccess(item.roles));

  // ── Auth redirect ─────────────────────────
  useEffect(() => {
    if (!adminToken) navigate('/admin/login');
  }, [adminToken, navigate]);

  // ── Auto-expand group on route change ────
  useEffect(() => {
    const path = location.pathname;
    let active: MenuKey = null;
    for (const g of visibleNavGroups) {
      if (g.children.some(c => path.startsWith(c.to))) { active = g.key; break; }
    }
    setOpenGroup(active);
    // On mobile close drawer after navigation
    if (window.innerWidth < 768) setMobileOpen(false);
  }, [location.pathname, adminRole]);

  // ── Resize handler ────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Je, una uhakika unataka kuondoka?')) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      navigate('/admin/login');
    }
  };

  if (!adminToken) return null;

  // ── Toggle group (accordion) ───────────────
  const toggleGroup = (key: MenuKey) => {
    setOpenGroup(prev => (prev === key ? null : key));
  };

  // ── Active season ──────────────────────────
  const activeSeason = '2026';
  const pageTitle    = PAGE_TITLES[location.pathname] ?? 'Admin Panel';

  // ── Shared sidebar content ─────────────────
  const sidebarWidth = expanded ? 'w-64' : 'w-[68px]';

  // ─────────────────────────────────────────────────
  // Sidebar inner content (shared between desktop & mobile drawer)
  // ─────────────────────────────────────────────────
  const SidebarContent = ({ forceFull = false }: { forceFull?: boolean }) => {
    const full = forceFull || expanded;

    // ── single nav link ──
    const NavBtn = ({ to, label, Icon }: NavItem) => (
      <NavLink
        to={to}
        title={!full ? label : undefined}
        className={({ isActive }) =>
          `relative group flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer select-none
           ${full ? 'px-4 py-2.5' : 'px-0 py-2.5 justify-center'}
           ${isActive
             ? 'bg-[#D90429] text-white shadow-lg shadow-[#D90429]/20'
             : 'text-white/50 hover:text-white hover:bg-white/5'
           }`
        }
      >
        {() => (
          <>
            <Icon className={`shrink-0 ${full ? 'w-4 h-4' : 'w-5 h-5'}`} />
            {full && (
              <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">{label}</span>
            )}
            {/* Icon-only tooltip */}
            {!full && (
              <span className="
                absolute left-full ml-2 px-2.5 py-1.5 bg-[#111] border border-white/10 rounded-lg
                text-[9px] font-black uppercase tracking-wider text-white whitespace-nowrap
                opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50
              ">
                {label}
              </span>
            )}
          </>
        )}
      </NavLink>
    );

    // ── group with children ──
    const NavGroup = ({ gKey, label, Icon, children }: { gKey: MenuKey; label: string; Icon: React.ElementType; children: SubItem[] }) => {
      const isOpen    = openGroup === gKey;
      const anyActive = children.some(c => location.pathname.startsWith(c.to));

      if (!full) {
        // ICON-RAIL MODE: show parent icon + child tooltip on hover
        return (
          <div
            className="relative group"
            onMouseEnter={() => setHoveredGroup(gKey)}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            <button
              className={`w-full flex justify-center items-center py-2.5 rounded-xl transition-all cursor-pointer
                ${anyActive ? 'text-[#D90429]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title={label}
            >
              <Icon className="w-5 h-5 shrink-0" />
            </button>

            {/* Fly-out panel on hover */}
            <div className="
              absolute left-full top-0 ml-3 w-44 bg-[#0f0f0f] border border-white/10 rounded-2xl
              shadow-2xl shadow-black/60 overflow-hidden z-[999]
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
              transition-all duration-150
            ">
              <div className="px-3 pt-3 pb-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{label}</span>
              </div>
              {children.map(child => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-[9px] font-bold uppercase tracking-wider transition-colors
                     ${isActive ? 'text-[#D90429]' : 'text-white/50 hover:text-white'}`
                  }
                >
                  <child.Icon className="w-3.5 h-3.5 shrink-0" />
                  {child.label}
                </NavLink>
              ))}
            </div>
          </div>
        );
      }

      // FULL EXPANDED MODE: accordion
      return (
        <div>
          <button
            onClick={() => toggleGroup(gKey)}
            className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider
              transition-all flex items-center justify-between cursor-pointer
              ${anyActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Animated accordion body */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key={gKey}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {/* Tree guide line */}
                <div className="ml-[22px] pl-4 border-l border-white/[0.07] mt-0.5 space-y-0.5 pb-1">
                  {children.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all
                         ${isActive
                           ? 'text-[#D90429] bg-[#D90429]/5'
                           : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                         }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Dot connector */}
                          <span className={`absolute -left-[17px] w-1.5 h-1.5 rounded-full border
                            ${isActive ? 'bg-[#D90429] border-[#D90429]' : 'bg-transparent border-white/20'}`}
                          />
                          <child.Icon className="w-3.5 h-3.5 shrink-0" />
                          {child.label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    return (
      <div className="flex flex-col h-full justify-between">
        {/* Top section */}
        <div className="space-y-5">
          {/* Brand */}
          <div className={`flex items-center ${full ? 'gap-3 px-2' : 'justify-center'} py-1`}>
            <div className="p-2 bg-[#D90429]/10 border border-[#D90429]/20 rounded-xl text-[#D90429] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {full && (
              <div className="leading-none">
                <p className="text-[10px] font-black uppercase text-[#D90429] tracking-widest font-outfit">TAPHE Admin</p>
                <p className="text-[9px] font-bold uppercase text-white/40 tracking-wider mt-0.5">Control Center</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Nav links */}
          <nav className={`flex flex-col space-y-0.5 overflow-y-auto max-h-[62vh] scrollbar-none ${full ? '' : 'items-center'}`}>
            {visibleTopItems.map(item => <NavBtn key={item.to} {...item} />)}

            <div className="pt-1" />

            {visibleNavGroups.map(g => {
                const { key, ...rest } = g;
                return <NavGroup key={key} gKey={key} {...rest} />;
            })}

            <div className="pt-1" />

            {visibleBottomItems.map(item => <NavBtn key={item.to} {...item} />)}
          </nav>
        </div>

        {/* Footer: user info + logout */}
        <div className={`border-t border-white/5 pt-4 space-y-3 ${full ? '' : 'flex flex-col items-center'}`}>
          {full && (
            <div className="px-2">
              <p className="text-xs font-bold text-white uppercase truncate">{adminUser.name || 'Admin'}</p>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{adminUser.role || 'Super Admin'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!full ? 'Sign Out' : undefined}
            className={`flex items-center gap-3 rounded-xl transition-all cursor-pointer
              text-white/50 hover:text-red-400 hover:bg-red-950/20 border border-white/5 hover:border-red-500/20
              text-[10px] font-black uppercase tracking-wider
              ${full ? 'w-full px-4 py-2.5 justify-center' : 'p-2.5 justify-center'}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {full && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#030303] text-white flex relative overflow-x-hidden">
      <div className="noise-overlay" />

      {/* ── MOBILE BACKDROP ────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── MOBILE DRAWER (slides in from left) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 380, damping: 35 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#070707] border-r border-white/5 p-5 md:hidden overflow-y-auto scrollbar-none"
          >
            <SidebarContent forceFull />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── DESKTOP SIDEBAR (persistent, collapsible to icon rail) ── */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-[#070707] border-r border-white/5 py-5
          transition-all duration-300 ease-in-out relative overflow-visible
          ${sidebarWidth}`}
      >
        <div className={`px-3 h-full ${expanded ? '' : 'flex flex-col items-center'}`}>
          <SidebarContent />
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────── */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#030303]/90 backdrop-blur-md border-b border-white/5 px-6 md:px-8 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger — always visible */}
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileOpen(prev => !prev);
                } else {
                  setExpanded(prev => !prev);
                }
              }}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white cursor-pointer shrink-0 transition-all"
              title="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest font-outfit">Active Section</span>
              <h2 className="text-lg md:text-xl font-black text-white uppercase leading-tight mt-0.5">
                {pageTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-wider text-white/60">
              Season: {activeSeason}
            </span>
          </div>
        </header>

        {/* Page content with smooth transition */}
        <div className="flex-grow p-6 md:p-10 text-left overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}





