export default function ProfileAvatar({ avatar, name }) {
  return (
    <div className="relative">
      <div className="absolute left-8 -top-16 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 hidden md:block z-10">
        {avatar?.url ? (
          <img src={avatar.url} alt={name || 'User avatar'} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            ?
          </div>
        )}
      </div>
      <div className="flex justify-center -mt-16 z-10 md:hidden">
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
          {avatar?.url ? (
            <img src={avatar.url} alt={name || 'User avatar'} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 