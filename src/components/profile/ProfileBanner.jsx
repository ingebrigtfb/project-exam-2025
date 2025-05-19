export default function ProfileBanner({ banner }) {
  if (!banner?.url) return <div className="h-36 bg-gray-200 w-full max-w-[1400px] mx-auto" />;
  return (
    <div className="w-full h-36 md:h-54 max-w-[1400px] mx-auto overflow-hidden flex items-center justify-center">
      <img src={banner.url} alt="Profile banner" className="object-cover w-full h-full" />
    </div>
  );
} 