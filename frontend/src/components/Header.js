import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Wine } from 'lucide-react';
import { Button } from '../components/ui/button';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 backdrop-blur-xl bg-[#FDFBF7]/90 border-b border-[#E6DEC8] z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link" onClick={scrollToTop}>
            <img 
              src="https://customer-assets-jt897jd0.emergentagent.net/job_5e83b9ef-4f62-401a-add7-cdebc74ff0df/artifacts/mk3c9200_Logo_IrishWhiskeys_Banner_1200px.webp"
              alt="Irish Whiskeys Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={scrollToTop} 
              className="text-[#1D1D1D] hover:text-[#74CF6C] transition-colors font-medium" 
              data-testid="nav-home"
            >
              Reiseüberblick
            </button>
            <button 
              onClick={() => scrollToSection('itinerary')} 
              className="text-[#1D1D1D] hover:text-[#74CF6C] transition-colors font-medium" 
              data-testid="nav-itinerary"
            >
              Reiseroute (8 Tage)
            </button>
            <button 
              onClick={() => scrollToSection('hotels')} 
              className="text-[#1D1D1D] hover:text-[#74CF6C] transition-colors font-medium" 
              data-testid="nav-hotels"
            >
              Hotels
            </button>
            <button 
              onClick={() => scrollToSection('distilleries')} 
              className="text-[#1D1D1D] hover:text-[#74CF6C] transition-colors font-medium" 
              data-testid="nav-distilleries"
            >
              Destillerien
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-[#1D1D1D] hover:text-[#74CF6C] transition-colors font-medium" 
              data-testid="nav-pricing"
            >
              Leistungen & Preise
            </button>
            {isAuthenticated && (
              <Link to="/admin" className="text-[#1D1D1D] hover:text-[#74CF6C] transition-colors font-medium" data-testid="nav-admin">
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs text-[#5A544C]">
              <div className="font-medium text-[#74CF6C]">18.–25. Mai 2027</div>
              <div>Noch wenige Plätze</div>
            </div>

            <Button
              onClick={() => navigate('/booking')}
              className="hidden md:inline-flex bg-[#74CF6C] hover:bg-[#5eb556] text-white"
              size="sm"
              data-testid="header-book-btn"
            >
              Jetzt Platz sichern
            </Button>

            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
                data-testid="logout-btn"
              >
                Abmelden
              </Button>
            )}

            {!isAuthenticated && (
              <Link to="/admin/login" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm" data-testid="admin-login-link">
                  Admin
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E6DEC8]" data-testid="mobile-menu">
            <nav className="flex flex-col gap-4">
              <button onClick={scrollToTop} className="text-left text-[#1D1D1D] hover:text-[#74CF6C] font-medium">
                Reiseüberblick
              </button>
              <button onClick={() => scrollToSection('itinerary')} className="text-left text-[#1D1D1D] hover:text-[#74CF6C] font-medium">
                Reiseroute (8 Tage)
              </button>
              <button onClick={() => scrollToSection('hotels')} className="text-left text-[#1D1D1D] hover:text-[#74CF6C] font-medium">
                Hotels
              </button>
              <button onClick={() => scrollToSection('distilleries')} className="text-left text-[#1D1D1D] hover:text-[#74CF6C] font-medium">
                Destillerien
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-left text-[#1D1D1D] hover:text-[#74CF6C] font-medium">
                Leistungen & Preise
              </button>
              <Button
                onClick={() => { navigate('/booking'); setMobileMenuOpen(false); }}
                className="bg-[#74CF6C] hover:bg-[#5eb556] text-white w-full"
                size="sm"
              >
                Jetzt Platz sichern
              </Button>
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="text-[#1D1D1D] hover:text-[#74CF6C] font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                  <button onClick={handleLogout} className="text-left text-[#74CF6C] font-medium">
                    Abmelden
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="text-[#74CF6C] font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Admin Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
