import { useState } from 'react';
import { GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
      login('student');
      toast.success("Login successful!");
      navigate('/dashboard');
    } else if (selectedRole === 'Admin') {
      login('admin');
      toast.success("Admin login successful!");
      navigate('/dashboard');
    } else if (selectedRole === 'Faculty') {
      login('faculty');
      toast.success("Faculty login successful!");
      navigate('/dashboard');
    } else {
      toast.error(`Please select a role before logging in`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap size={32} className="text-gray-800" />
            <h1 className="text-xl font-medium">MyStudentInfo</h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-blue-50">
        <div
          className="w-full max-w-md bg-white rounded-lg shadow-md flex flex-col"
          style={{ minHeight: '400px' }}
        >
          <div className="p-8 flex-1">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {/* Role Selection Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Select a Role</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center bg-white"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span>{selectedRole || 'Select role...'}</span>
                  <span className="text-blue-400">▼</span>
                </button>

                {showDropdown && (
                  <div className="absolute w-full mt-1 border border-gray-300 bg-white rounded-md shadow-lg z-50">
                    {['Student', 'Faculty', 'Admin'].map((role) => (
                      <div
                        key={role}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRoleSelect(role)}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="p-8">
            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition-all"
              onClick={handleLogin}
              disabled={!selectedRole}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              <span>SIGN IN WITH GOOGLE</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600">
        <p>© 2025 MyStudentInfo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
