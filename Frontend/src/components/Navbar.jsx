import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, Users, FileText, Briefcase, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/profile");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      {/* Left side links */}
      <div className="flex gap-6 items-center">
        {user && (
          <>
            <Link to="/profile" className="flex items-center gap-1 hover:text-blue-600">
              <User size={18} /> Profile
            </Link>
            <Link to="/connections" className="flex items-center gap-1 hover:text-blue-600">
              <Users size={18} /> Connections
            </Link>
            <Link to="/applications" className="flex items-center gap-1 hover:text-blue-600">
              <FileText size={18} /> Applications
            </Link>
            {user.userType === "ADMIN" && (
              <Link to="/admin" className="flex items-center gap-1 hover:text-blue-600">
                <Briefcase size={18} /> Admin
              </Link>
            )}
          </>
        )}
      </div>

      {/* Right side (logout/login) */}
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <span className="text-gray-500 text-sm">Not logged in</span>
        )}
      </div>
    </nav>
  );
}
