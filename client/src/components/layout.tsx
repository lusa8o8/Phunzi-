import { Link, useLocation } from "wouter";
import { Home, BookOpen, PlusCircle, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@assets/generated_images/minimalist_logo_for_phunzi+_unza.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-background min-h-screen shadow-xl relative flex flex-col">
        
        {/* Header */}
        <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Phunzi+" className="h-8 w-8 object-contain" />
            <span className="font-serif font-bold text-xl text-primary tracking-tight">Phunzi+</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-sm">
            ZM
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-20 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-md bg-card border-t flex justify-around items-center h-16 pointer-events-auto pb-safe">
            <NavItem href="/" icon={Home} label="Discover" active={location === "/"} />
            <NavItem href="/feed" icon={BookOpen} label="My Courses" active={location === "/feed"} />
            
            {/* Upload Button (Prominent) */}
            <Link href="/upload">
              <div className={cn(
                "relative -top-5 h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-transform active:scale-95",
                location === "/upload" && "ring-4 ring-secondary"
              )}>
                <PlusCircle size={28} />
              </div>
            </Link>

            <NavItem href="/messages" icon={Search} label="Search" active={location === "/search"} />
            <NavItem href="/profile" icon={User} label="Profile" active={location === "/profile"} />
          </div>
        </nav>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}>
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    </Link>
  );
}
