import { FaGlobe } from 'react-icons/fa';

export default function ProfileCard({ user }) {
  if (!user) return null;
  
  const { name, email, bio, venueManager, avatar } = user;
  
  return (
    <div className="w-full -mt-20 md:-mt-30 relative z-10">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Mobile Header */}
        <div className="h-16 bg-white md:hidden"></div>
        
        <div className="px-4 py-4">
          <div className="flex flex-col">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start -mt-16 md:mt-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#0C5560] shadow-lg overflow-hidden bg-gray-100">
                {avatar?.url ? (
                  <img src={avatar.url} alt={name || 'User avatar'} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 bg-gray-100">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex flex-col mt-3 text-center md:text-left">
              <div className="flex flex-col md:items-start items-center">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{name}</h1>
                <div className="text-sm md:text-base text-gray-500">{name.toLowerCase().replace(/\s+/g, '')}</div>
              </div>
              
              {/* Role Badge */}
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  venueManager 
                    ? 'bg-[#0C5560] text-white' 
                    : 'bg-[#0C5560] text-white'
                }`}>
                  {venueManager ? 'Venue Manager' : 'Guest'}
                </span>
              </div>
              
              {/* Bio */}
              {bio && (
                <p className="mt-3 text-gray-700 text-sm md:text-base">{bio}</p>
              )}
              
              {/* Email Info */}
              {email && (
                <div className="mt-4 flex items-center justify-center md:justify-start text-gray-500 text-sm">
                  <FaGlobe className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span>{email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 