
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types';

interface HeaderProps {
  toggleSidebar: () => void;
}

const roleColors: Record<UserRole, string> = {
  sales: 'bg-blue-100 text-blue-800',
  reception: 'bg-purple-100 text-purple-800',
  tester: 'bg-green-100 text-green-800',
  manager: 'bg-amber-100 text-amber-800',
  customer: 'bg-rose-100 text-rose-800',
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const { currentUser, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = currentUser?.name || 'Guest';
  const roleClass = currentUser?.role ? roleColors[currentUser.role] : '';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-semibold text-white">TS</span>
            </div>
            <span className="hidden font-bold sm:inline-block">TestQuest</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <span className="hidden md:inline-block font-medium">{displayName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${roleClass}`}>
                    {currentUser.role}
                  </span>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Role switcher for demo purposes */}
                <DropdownMenuLabel>Demo: Switch Role</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => switchRole('sales')}>
                  Sales
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('reception')}>
                  Reception
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('tester')}>
                  Tester
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('manager')}>
                  Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('customer')}>
                  Customer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
