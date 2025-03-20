import { useEffect, useState } from "react";
import DashboardHeader from "./StudentDashboardHeader";

const PageTemplate = ({ title, children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <DashboardHeader title={title} />
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-32 rounded-lg"></div>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ animationDelay: "150ms" }}>
          {children || (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-xl text-gray-700 mb-2">This is the {title} section</h2>
              <p className="text-gray-500">
                This page is currently under development. Check back soon for updates.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageTemplate;