
import { Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { toast } = useToast();
  
  const handleEdit = () => {
    toast({
      title: "Edit mode",
      description: "",
    });
  };

  return (
    <div className="flex justify-between items-center p-6 bg-dashboard-header rounded-xl shadow-sm mb-6 animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-2xl font-medium text-gray-800">{title}</h1>
        {/* <button 
          onClick={handleEdit}
          className="ml-3 p-1.5 rounded-full hover:bg-white/60 transition-all"
          aria-label="Edit dashboard"
        > */}
          {/* <Edit2 size={18} className="text-gray-600" /> */}
        {/* </button> */}
      </div>
    </div>
  );
};

export default DashboardHeader;
