
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-sm animate-fade-in">
        <h1 className="text-6xl font-light mb-6 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
