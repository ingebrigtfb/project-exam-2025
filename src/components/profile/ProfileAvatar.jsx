import { FaUserCircle } from 'react-icons/fa';

export default function ProfileAvatar({ user, size = "md", useWhite = false }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };
  
  const iconColor = useWhite ? "text-white" : "text-[#0C5560]";
  
  return user ? (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
      {user.avatar?.url ? (
        <img
          src={user.avatar.url}
          alt={user.name || 'User avatar'}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className={`flex items-center justify-center h-full w-full ${useWhite ? "bg-transparent" : "bg-gray-100"}`}>
          <FaUserCircle className={`h-full w-full ${iconColor}`} />
        </div>
      )}
    </div>
  ) : (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <FaUserCircle className={`h-full w-full ${iconColor}`} />
    </div>
  );
} 