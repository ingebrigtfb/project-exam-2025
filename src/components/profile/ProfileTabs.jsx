import { CiSettings } from "react-icons/ci";
import { FaCalendarAlt, FaBuilding, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const tabs = [
  { label: 'Bookings', key: 'bookings', icon: FaCalendarAlt },
  { label: 'Venues', key: 'venues', icon: FaBuilding },
  { label: 'Favorites', key: 'favorites', icon: FaHeart },
  { label: 'Account', key: 'settings', icon: CiSettings },
];

export default function ProfileTabs({ activeTab, onTabChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    window.location.reload();
  };
  
  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex justify-between">
        <div className="flex overflow-x-auto scrollbar-hide flex-grow">
          {tabs.map(tab => (
            <Link
              key={tab.key}
              to={`/profile?tab=${tab.key}`}
              className={`px-4 py-4 text-sm font-medium transition-colors duration-200 focus:outline-none relative flex-1 md:flex-none
                ${activeTab === tab.key
                  ? 'text-[#0C5560] font-semibold'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}
              `}
              onClick={(e) => {
        
                onTabChange(tab.key);
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2">
                {tab.icon && (
                  <tab.icon 
                    className={`text-2xl md:text-2xl ${
                      activeTab === tab.key ? 'text-[#0C5560]' : 'text-gray-500'
                    }`} 
                  />
                )}
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0C5560]"></div>
              )}
            </Link>
          ))}
          
          {/* Logout Tab - Mobile Only */}
          <button
            onClick={handleLogout}
            className="md:hidden px-4 py-4 text-sm font-medium transition-colors duration-200 focus:outline-none relative flex-1 text-red-600 hover:text-red-800 hover:bg-gray-50"
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <FaSignOutAlt className="text-2xl" />
              <span>Logout</span>
            </div>
          </button>
        </div>
        
        {/* Logout Button - Desktop */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-6 text-red-600 hover:text-red-800 transition-colors border-l border-gray-200"
        >
          <FaSignOutAlt className="text-lg" />
        </button>
      </div>
    </div>
  );
} 