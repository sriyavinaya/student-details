
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap size={32} className="text-gray-800" />
          <h1 className="text-xl font-medium">MyStudentInfo</h1>
        </div>
        <Link 
          to="/login" 
          className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-gray-800 rounded-md transition-all"
        >
          LOGIN
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 bg-blue-50">
        <div className="md:w-1/2 max-w-2xl p-8 bg-blue-100 rounded-3xl mb-8 md:mb-0 md:mr-8">
          <h2 className="text-2xl font-bold mb-6 text-center">About Us</h2>
          <p className="text-gray-800 text-center leading-relaxed">
            At MyStudentInfo, we simplify the way institutions manage and
            access student information. Our platform integrates data from
            curricular and co-curricular activities, making it easy for
            administrators, faculty, and students to stay organized.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="/lovable-uploads/db28448e-955b-4545-b428-ed55879645b5.png" 
            alt="Student Reading" 
            className="max-w-full h-auto max-h-80"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600">
        <p>© 2023 MyStudentInfo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
