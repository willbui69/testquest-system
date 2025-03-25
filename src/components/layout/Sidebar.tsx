
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Beaker, 
  ClipboardList, 
  Download, 
  FileText, 
  Home, 
  MessagesSquare, 
  Package, 
  Settings, 
  UserCircle, 
  Users,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'customer';

  // Role-based menu items
  const menuItems = {
    sales: [
      { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
      { name: 'Customers', icon: <Users size={18} />, path: '/customers' },
      { name: 'Quotes', icon: <DollarSign size={18} />, path: '/quotes' },
      { name: 'Requests', icon: <ClipboardList size={18} />, path: '/requests' },
      { name: 'Messages', icon: <MessagesSquare size={18} />, path: '/messages' },
    ],
    reception: [
      { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
      { name: 'Item Registration', icon: <Package size={18} />, path: '/items' },
      { name: 'Test Assignments', icon: <ClipboardList size={18} />, path: '/assignments' },
      { name: 'Reports', icon: <FileText size={18} />, path: '/reports' },
    ],
    tester: [
      { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
      { name: 'My Assignments', icon: <ClipboardList size={18} />, path: '/assignments' },
      { name: 'Test Results', icon: <Beaker size={18} />, path: '/results' },
    ],
    manager: [
      { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
      { name: 'Approve Reports', icon: <FileText size={18} />, path: '/approvals' },
      { name: 'Statistics', icon: <BarChart3 size={18} />, path: '/statistics' },
      { name: 'Staff', icon: <Users size={18} />, path: '/staff' },
    ],
    customer: [
      { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
      { name: 'My Requests', icon: <ClipboardList size={18} />, path: '/requests' },
      { name: 'Quotes', icon: <DollarSign size={18} />, path: '/quotes' },
      { name: 'Download Reports', icon: <Download size={18} />, path: '/reports' },
      { name: 'Messages', icon: <MessagesSquare size={18} />, path: '/messages' },
    ],
  };

  const activeMenuItems = menuItems[role] || [];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full py-6">
        <div className="mb-6 px-6 text-lg font-semibold">
          {role.charAt(0).toUpperCase() + role.slice(1)} Portal
        </div>
        
        <nav className="flex-1 space-y-1 px-3">
          {activeMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "sidebar-item",
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              )}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsOpen(false);
                }
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto px-3 space-y-1">
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "sidebar-item",
              isActive ? "sidebar-item-active" : "sidebar-item-inactive"
            )}
          >
            <UserCircle size={18} />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "sidebar-item",
              isActive ? "sidebar-item-active" : "sidebar-item-inactive"
            )}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
