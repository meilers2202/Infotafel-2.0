import axios from "axios";
import { useEffect, useState } from "react";

export default function Events({ isActive }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:1337/api/events?populate=*`);
        setEvents(response.data.data || []);
      } catch (e) {
        setError("Events konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white/50 text-center py-20">Lade Events...</div>;
  if (error) return <div className="text-red-400 text-center py-20">{error}</div>;

  return (
    /* mt-[10vh] für den Abstand, h-[90vh] für die volle Browser-Nutzung */
    <div className="w-full max-w-6xl mx-auto px-6 mt-[2vh] h-[85vh] flex flex-col">
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-20">
        {events.map((eventItem) => {
          const item = eventItem.attributes || eventItem;
          const imageUrl = item.image?.data?.attributes?.url 
                           ? `http://localhost:1337${item.image.data.attributes.url}` 
                           : "/placeholder.jpg";

          return (
            <div
              key={eventItem.id}
              className="flex flex-col md:flex-row items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-[30px] overflow-hidden hover:bg-white/10 transition-all duration-300 min-h-[320px]"
              tabIndex={isActive ? 0 : -1}
            >
              {/* Text-Bereich: Nimmt den restlichen Platz ein */}
              <div className="p-8 md:p-12 flex-1">
                <h2 className="text-white text-3xl font-bold mb-4 tracking-tight">
                  {item.title}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Bild-Bereich: Feste Größe */}
              <div className="w-full md:w-[320px] h-[320px] shrink-0 p-4">
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-[20px] border-2 border-white/10 shadow-2xl"
                />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { 
          width: 6px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(255, 255, 255, 0.2); 
        }
      `}</style>
    </div>
  );
}