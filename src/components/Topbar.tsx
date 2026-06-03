import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "User";

  const handleSearch = (e) => {
    const term = e.target.value;
    if (term.trim() !== "") {
      navigate(`/incidents?search=${encodeURIComponent(term)}`);
    } else {
      navigate(`/incidents`);
    }
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex justify-between items-center sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search incidents..." 
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
          onChange={handleSearch}
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-indigo-600 transition-colors">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-tight">{fullName}</p>
            <p className="text-[11px] text-gray-500 font-medium">Verified Account</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm uppercase">
            {fullName[0]}
          </div>
        </div>
      </div>
    </header>
  );
}