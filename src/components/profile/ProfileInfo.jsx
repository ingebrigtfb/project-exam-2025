export default function ProfileInfo({ name, email, bio, venueManager }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mt-2 px-4 md:pl-44 md:pr-8 w-full">
      <div className="flex flex-col items-center md:items-start md:w-1/2">
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="text-gray-600 text-sm mb-1">{venueManager ? 'Venue manager' : 'Guest'}</div>
        <div className="text-gray-500 text-sm">{email}</div>
      </div>
      <div className="mt-4 md:mt-0 md:text-left max-w-md md:w-1/2">
        <div className="font-semibold">About {name}:</div>
        <div className="text-gray-700 whitespace-pre-line break-words">{bio}</div>
      </div>
    </div>
  );
} 