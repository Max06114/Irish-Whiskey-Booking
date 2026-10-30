import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Hotel, CalendarCheck, CreditCard, LogOut, 
  Bell, Clock, Image as ImageIcon, Package, Music, BarChart3, FileText, Mail, MailCheck, Bus, Users, Building2
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { t, language } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/bookings', icon: CalendarCheck, label: 'Buchungen' },
    { path: '/admin/inventory', icon: Package, label: 'Lagerhaltung' },
    { path: '/admin/hotel-management', icon: Building2, label: 'Hotel-Verwaltung' },
    { path: '/admin/roommates', icon: Users, label: 'Zimmerpartner' },
    { path: '/admin/payments', icon: CreditCard, label: 'Zahlungen' },
    { path: 'https://resend.com/emails', icon: Mail, label: 'E-Mail-Übersicht', external: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#1A1A1A] z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6B1D2A] rounded-full flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-lg text-white">Admin</span>
                <p className="text-xs text-white/50">Travel Events</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                      <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${location.pathname === item.path 
                          ? 'bg-[#6B1D2A] text-white' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'}
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white transition-colors"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-5 h-5" />
              {t('logout')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
