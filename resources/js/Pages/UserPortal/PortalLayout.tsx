import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Award,
  Ticket,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch authenticated user
    const token = localStorage.getItem('user_token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/api/v1/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('auth_user');
        window.dispatchEvent(new Event('taphe:user-auth-changed'));
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('user_token');
      await axios.post('/api/v1/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('user_token');
      localStorage.removeItem('auth_user');
      window.dispatchEvent(new Event('taphe:user-auth-changed'));
      navigate('/login');
    }
  };

  const menuItems = [
    { name: 'Overview', path: '/portal', icon: LayoutDashboard },
    { name: 'Nominations', path: '/portal/applications', icon: Award },
    { name: 'My Tickets', path: '/portal/tickets', icon: Ticket },
    { name: 'Account Settings', path: '/portal/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#D90429] selection:text-white font-inter flex relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D90429]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4A853]/5 rounded-full blur-[120px]" />
      </div>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR SIDE PANEL */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#080506] border-r border-white/5 z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-8 pt-6">
          {/* Logo & Portal Branding */}
          <div className="px-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                loading="lazy"
                src="/images/logo_hero.webp"
                alt="TAPHE Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="text-white font-outfit font-black text-xs tracking-wider uppercase">TAPHE</span>
                <span className="text-[#D90429] font-outfit font-black text-[9px] tracking-wider uppercase mt-0.5">Portal</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D90429] to-[#FF3D57] text-white shadow-lg shadow-[#D90429]/10'
                      : 'text-white/55 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Back and Logout buttons */}
        <div className="p-4 space-y-2 border-t border-white/5 bg-[#0b0708]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/55 hover:text-white hover:bg-white/[0.03] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Main Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white hover:bg-red-600/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
        {/* HEADER BAR */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#080506]/35 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-outfit font-black text-sm uppercase tracking-widest hidden sm:block text-white/60">
              Welcome to Health Excellence Portal
            </h1>
          </div>

          {/* User Status Bar */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="text-right">
                  <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-white/40 font-light leading-none mt-0.5">{user.email}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D90429]/20 to-[#D4A853]/20 border border-white/10 flex items-center justify-center text-[#D90429] font-outfit font-black text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto pb-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
