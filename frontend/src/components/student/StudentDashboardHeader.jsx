import { Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = ({ title }) => {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center p-6 bg-dashboard-header rounded-xl shadow-sm mb-6 animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-2xl font-medium text-gray-800">{title}</h1>
      </div>
    </div>
  );
};

export default DashboardHeader;