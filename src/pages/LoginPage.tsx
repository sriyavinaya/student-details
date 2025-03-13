
import { useState } from 'react';
import nitc from '../assets/nitc.png';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setShowDropdown(false);
  };

  const handleLogin = () => {
    if (selectedRole === 'Student') {
      // Use the login function from AuthContext
      login('student');
      toast.success("Login successful!");
      navigate('/dashboard');
    } else if (selectedRole === 'Admin') {
      login('admin');
      toast.success("Admin login successful!");
      navigate('/admin');
    } else if (selectedRole === 'Faculty') {
      login('faculty');
      toast.success("Faculty login successful!");
      navigate('/faculty');
    } else {
      toast.error(`Please select a role before logging in`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#D5E2ED]">
      {/* Header */}
      <header className="bg-[#d9d9d9] py-4 px-6 shadow-sm">
        <div className="flex items-center space-x-2">
          {/* <GraduationCap size={36} className="text-blue-700" /> */}
          <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
          {/* Image Side */}
          <div className="hidden md:block w-1/2 relative">
            <img 
              src={nitc}
              alt="NIT Calicut Campus" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/20 flex flex-col justify-end p-8">
            </div>
          </div>
          
          {/* Login Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Please sign in to continue</p>
              </div>
              
              {/* Role Selection Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg flex justify-between items-center bg-white hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className={selectedRole ? "text-gray-800" : "text-gray-500"}>
                      {selectedRole || 'Select role...'}
                    </span>
                    <span className="text-blue-500">▼</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute w-full mt-1 border border-gray-300 bg-white rounded-lg shadow-lg z-10 animate-slide-in">
                      {['Student', 'Faculty', 'Admin'].map((role) => (
                        <div
                          key={role}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => handleRoleSelect(role)}
                        >
                          {role}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sign In Button */}
              <Button
                className="w-full py-6 bg-[#D5E2ED] hover:bg-[#c4d3e0] text-gray-800 font-medium rounded-lg transition-colors"
                onClick={handleLogin}
                disabled={!selectedRole}
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5 mr-2" 
                />
                Sign in with Google
              </Button>
              
              <p className="text-center text-sm text-gray-600 mt-8">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#d9d9d9] py-4 px-6 text-center text-gray-600 shadow-inner">
        <p>© {new Date().getFullYear()} Student Details. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
