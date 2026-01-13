import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

const POPULAR_CITIES = [
  "Delhi, Delhi, IN",
  "Mumbai, Maharashtra, IN",
  "Bangalore, Karnataka, IN",
  "Chennai, Tamil Nadu, IN",
  "Kolkata, West Bengal, IN",
  "Srinagar, Jammu and Kashmir, IN",
  "New York City, New York, US",
  "Los Angeles, California, US",
  "London, England, UK",
  "Dubai, Dubai, AE"
];

function CityDropdown({ apiKey, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
 
 
  const debouncedQuery = useDebounce(query, 600);

 
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  useEffect(() => {
  
    if (debouncedQuery.trim().length < 3) {
      setResults([]);
      return;
    }

    async function searchCities() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${debouncedQuery}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    searchCities();
  }, [debouncedQuery, apiKey]);

  const handleSelect = (cityString) => {
    onSelect(cityString);
    setQuery(""); 
    setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  
    setOpen(true);
  };

  return (
    <div ref={dropdownRef} className="relative w-full z-50">
     
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors pointer-events-none">
          🔍
        </span>
       
        <input
          type="text"
          value={query}
          placeholder="Search city..."
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all shadow-sm font-medium"
        />

     
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 transition-colors"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

  
      {open && (
        <div className="absolute w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
         
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
          
            {loading && (
              <div className="p-4 text-center text-slate-400 text-sm">
                Searching...
              </div>
            )}

          
            {query.length < 3 && !loading && (
              <div>
                <div className="px-4 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-100">
                  Popular Cities
                </div>
                {POPULAR_CITIES.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(city)}
                    className="px-4 py-3 cursor-pointer hover:bg-sky-50 text-slate-600 hover:text-sky-700 border-b border-slate-50 last:border-none transition-colors text-sm font-medium"
                  >
                    {city.split(",")[0]}
                    <span className="text-xs text-slate-400 ml-1 font-normal">
                       {city.substring(city.indexOf(","))}
                    </span>
                  </div>
                ))}
              </div>
            )}

       
            {query.length >= 3 && !loading && results.length > 0 && (
              <div>
                {results.map((city) => (
                   <div
                    key={`${city.id}-${city.lat}`} 
                    onClick={() => handleSelect(`${city.name}, ${city.region}, ${city.country}`)}
                    className="px-4 py-3 cursor-pointer hover:bg-sky-50 text-slate-700 border-b border-slate-50 last:border-none transition-colors flex flex-col items-start"
                  >
                    <span className="font-semibold text-sm text-slate-800">
                      {city.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {city.region}, {city.country}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {query.length >= 3 && !loading && results.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-sm">
                No cities found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CityDropdown;