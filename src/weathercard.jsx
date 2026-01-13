import CityDropdown from "./CityDropdown";

export default function WeatherCard({ data, apiKey, onSelect, loading, error }) {
  return (
    <div className="w-full max-w-sm bg-blue-50 text-blue-900 rounded-xl p-6 shadow-md">
     
      <CityDropdown apiKey={apiKey} onSelect={onSelect} />

      {loading && (
        <p className="text-center mt-4 text-blue-400">Loading...</p>
      )}

      {error && !loading && (
        <p className="text-center mt-4 text-red-400">{error}</p>
      )}

      {data && !loading && (
        <div className="mt-6 text-center">
         
      
          <h2 className="text-xl font-semibold">
            {data.location.name}
          </h2>
          <p className="text-sm text-blue-600">
            {data.location.region}, {data.location.country}
          </p>

       
          <img
            src={`https:${data.current.condition.icon}`}
            alt={data.current.condition.text}
            className="mx-auto my-4"
          />

       
          <p className="text-4xl font-bold text-blue-900">
            {Math.round(data.current.temp_c)}°
          </p>

          <p className="text-blue-600 mt-1">
            {data.current.condition.text}
          </p>

       
          <div className="grid grid-cols-3 gap-3 mt-6">
      
            <div className="bg-blue-100 rounded-lg p-3 flex flex-col items-center">
              <span className="text-2xl mb-1">💧</span>
              <p className="text-sm font-semibold text-blue-800">
                {data.current.humidity}%
              </p>
              <p className="text-[10px] text-blue-500 uppercase">
                Humidity
              </p>
            </div>

            <div className="bg-blue-100 rounded-lg p-3 flex flex-col items-center">
              <span className="text-2xl mb-1">☁️</span>
              <p className="text-sm font-semibold text-blue-800">
                {data.current.cloud}%
              </p>
              <p className="text-[10px] text-blue-500 uppercase">
                Cloud
              </p>
            </div>

     
            <div className="bg-blue-100 rounded-lg p-3 flex flex-col items-center">
              <span className="text-2xl mb-1">💨</span>
              <p className="text-sm font-semibold text-blue-800">
                {data.current.wind_kph} km/h
              </p>
              <p className="text-[10px] text-blue-500 uppercase">
                Wind
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
