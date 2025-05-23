export default function ProfileBanner({ banner }) {
  if (!banner?.url) return (
    <div className="h-48 md:h-64 bg-gray-200 w-full relative">
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
  
  return (
    <div className="w-full h-48 md:h-64 overflow-hidden flex items-center justify-center relative">
      <img src={banner.url} alt="Profile banner" className="object-cover w-full h-full" />
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
} 