import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { Sparkles } from "lucide-react";

export default function CustomerHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Solutions", href: "/solutions" },
    { label: "Industries", href: "#industries" },
    { label: "Results", href: "#results" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Shatzii
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-cyan-400">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-slate-300" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-slate-900 border-slate-800">
            <div className="flex flex-col space-y-6 mt-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-slate-300 hover:text-cyan-400">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}