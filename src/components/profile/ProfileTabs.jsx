const tabs = [
  { label: 'My bookings', key: 'bookings' },
  { label: 'My venues', key: 'venues' },
  { label: 'My favorites', key: 'favorites' },
  { label: 'Account settings', key: 'settings' },
];

export default function ProfileTabs({ activeTab, onTabChange }) {
  return (
    <div className="w-full flex justify-center mt-8">
      <div className="flex w-full md:w-auto border-b border-gray-200 md:bg-white md:rounded-t-lg md:shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`flex-1 px-2 py-3 md:px-8 md:py-1 transition font-medium focus:outline-none
              ${activeTab === tab.key
                ? 'border-b-4 border-[#0C5560] text-[#0C5560] bg-white md:bg-white z-10'
                : 'border-b-4 border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100 md:bg-gray-50'}
              md:rounded-t-lg
            `}
            style={{ minWidth: 0, maxWidth: 200 }}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
} 