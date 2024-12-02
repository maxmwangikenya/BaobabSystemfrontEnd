export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            {/* Notification Icon */}
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">John Doe</span>
            {/* Profile Image */}
          </div>
        </div>
      </div>
    </header>
  );
}