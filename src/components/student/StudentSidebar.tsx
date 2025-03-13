
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Settings, 
  Users, 
  BookOpen, 
  Award, 
  Briefcase, 
  FileText, 
  FileDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ to, icon, label, isCollapsed }: SidebarItemProps) => {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }
        title={isCollapsed ? label : undefined}
      >
        <span className={cn("text-gray-600", isCollapsed ? "mx-auto" : "mr-3")}>{icon}</span>
        {!isCollapsed && label}
      </NavLink>
    </li>
  );
};

const StudentSidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const sidebarItems = [
    { to: "/dashboard", icon: <Home size={18} />, label: "Dashboard", id: "dashboard" },
    { to: "/dashboard/technical", icon: <Settings size={18} />, label: "Technical", id: "technical" },
    { to: "/dashboard/cultural", icon: <Users size={18} />, label: "Cultural", id: "cultural" },
    { to: "/dashboard/sports", icon: <Award size={18} />, label: "Sports", id: "sports" },
    { to: "/dashboard/clubs", icon: <BookOpen size={18} />, label: "Clubs and Societies", id: "clubs" },
    { to: "/dashboard/internships", icon: <Briefcase size={18} />, label: "Internships and Placements", id: "internships" },
    { to: "/dashboard/publications", icon: <FileText size={18} />, label: "Publications", id: "publications" },
    { to: "/dashboard/history", icon: <FileDown size={18} />, label: "Export Records", id: "history" },
  ];

  return (
    <div 
      className={cn(
        "h-full bg-dashboard-sidebar overflow-y-auto animate-fade-in transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="p-4 pb-6">
        <button 
          onClick={toggleSidebar}
          className="w-full flex justify-end mb-5 text-gray-600 hover:text-gray-900"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
            >
              <SidebarItem 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                isCollapsed={collapsed} 
              />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentSidebar;
