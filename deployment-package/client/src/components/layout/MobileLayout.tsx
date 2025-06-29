import React from "react";
import { Link, useLocation } from "wouter";
import { 
  HomeIcon, 
  VideoIcon, 
  GraduationCapIcon, 
  UserIcon, 
  MenuIcon,
  X,
  SunMoon
} from "lucide-react";

type MobileLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export function MobileLayout({ children, title = "Go4It Sports" }: MobileLayoutProps) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-mode');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0e1628] text-white' : 'bg-white text-[#0e1628]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-[#111827]' : 'bg-white border-b border-gray-200'} backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              Go4It <span className="text-blue-400">Sports</span>
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              <SunMoon size={20} />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Open menu"
            >
              {menuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div 
          className={`fixed inset-0 z-40 ${theme === 'dark' ? 'bg-[#111827]' : 'bg-white'}`}
          style={{ top: '56px' }}
        >
          <nav className="container mx-auto px-4 py-6">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${location === '/' ? 'bg-blue-600' : 'hover:bg-gray-800'} transition-colors`}
                >
                  <HomeIcon size={20} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/videos" 
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${location === '/videos' ? 'bg-blue-600' : 'hover:bg-gray-800'} transition-colors`}
                >
                  <VideoIcon size={20} />
                  <span>Video Analysis</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/academics" 
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${location === '/academics' ? 'bg-blue-600' : 'hover:bg-gray-800'} transition-colors`}
                >
                  <GraduationCapIcon size={20} />
                  <span>Academics</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${location === '/profile' ? 'bg-blue-600' : 'hover:bg-gray-800'} transition-colors`}
                >
                  <UserIcon size={20} />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        {children}
      </main>

      {/* Bottom Nav Bar */}
      <nav className={`fixed bottom-0 w-full ${theme === 'dark' ? 'bg-[#111827] border-t border-gray-800' : 'bg-white border-t border-gray-200'} h-16`}>
        <div className="grid grid-cols-4 h-full">
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center ${location === '/' ? 'text-blue-400' : ''}`}
          >
            <HomeIcon size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link 
            href="/videos" 
            className={`flex flex-col items-center justify-center ${location === '/videos' ? 'text-blue-400' : ''}`}
          >
            <VideoIcon size={20} />
            <span className="text-xs mt-1">Videos</span>
          </Link>
          <Link 
            href="/academics" 
            className={`flex flex-col items-center justify-center ${location === '/academics' ? 'text-blue-400' : ''}`}
          >
            <GraduationCapIcon size={20} />
            <span className="text-xs mt-1">Academics</span>
          </Link>
          <Link 
            href="/profile" 
            className={`flex flex-col items-center justify-center ${location === '/profile' ? 'text-blue-400' : ''}`}
          >
            <UserIcon size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
      
      {/* Bottom Padding for Navigation */}
      <div className="h-16"></div>
    </div>
  );
}