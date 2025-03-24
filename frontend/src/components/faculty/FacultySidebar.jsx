import { useState } from "react";
import { NavLink , useParams} from "react-router-dom";
import { 
  Home, 
  Users, 
  FileCheck, 
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";


const SidebarItem = ({ to, icon, label, isCollapsed }) => {
  return (
    <li>
      <NavLink 
        to={to} 
        end
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

const FacultySidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  
  
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const sidebarItems = [
    { to: `/faculty/${id}`, icon: <Home size={18} />, label: "Dashboard", id: "dashboard" },
    { to: `/faculty/${id}/student-profiles`, icon: <Users size={18} />, label: "Student Profiles", id: "student-profiles" },
    { to: `/faculty/${id}/profile-verification`, icon: <FileCheck size={18} />, label: "Profile Verification", id: "profile-verification" },
    { to: `/faculty/${id}/export-details`, icon: <Download size={18} />, label: "Export Details", id: "export-details" },
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

export default FacultySidebar;