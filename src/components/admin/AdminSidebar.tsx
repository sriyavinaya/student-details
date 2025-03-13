import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  Edit, 
  FileInput,
  ChevronLeft,
  ChevronRight,
  FileDown
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

const AdminSidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const sidebarItems = [
    { to: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard", id: "dashboard" },
    { to: "/admin/student-profiles", icon: <Users size={18} />, label: "Student Profiles", id: "student-profiles" },
    { to: "/admin/faculty-profiles", icon: <Users size={18} />, label: "Faculty Profiles", id: "faculty-profiles" },
    { to: "/admin/flagged-records", icon: <Flag size={18} />, label: "Flagged Records", id: "flagged-records" },
    { to: "/admin/edit-fields", icon: <Edit size={18} />, label: "Edit Fields", id: "edit-fields" },
    { to: "/admin/import-details", icon: <FileInput size={18} />, label: "Import Details", id: "import-details" },
    { to: "/admin/export-details", icon: <FileDown size={18} />, label: "Export Details", id: "export-details" },
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

export default AdminSidebar;
