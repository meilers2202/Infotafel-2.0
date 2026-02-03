import axios from "axios";
import { useEffect, useState } from "react";

export default function Ticket({ isActive }) {
  const [tickets, setTickets] = useState([]);

  // Accessibility settings
  const tabIndexValue = isActive ? 0 : -1;
  const ariaHiddenValue = !isActive;

  // Get ticket information from Strapi API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/tickets?populate=*`
        );
        setTickets(response.data.data);
      } catch (e) {
        console.error("Fehler beim Laden der Tickets:", e);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div aria-hidden={ariaHiddenValue} className="min-h-screen p-8">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Informatik Ticket System</h1>
        <p className="text-gray-400 text-lg">Übersicht der aktuellen Support-Anfragen</p>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start ${
          isActive ? '' : 'pointer-events-none'
        }`}
      >
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg transform transition-all hover:border-yellow-500"
            tabIndex={tabIndexValue}
          >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded uppercase">
                {ticket.attributes?.Status || "Offen"}
              </span>
              <span className="text-gray-500 text-sm">#{ticket.id}</span>
            </div>

            {/* Ticket Content */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {ticket.attributes?.Titel || "Kein Titel"}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {ticket.attributes?.Beschreibung || "Keine Beschreibung verfügbar."}
              </p>
              
              <hr className="border-gray-700 my-4" />

              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500">Erstellt von:</span>
                <span className="text-yellow-400 font-medium">{ticket.attributes?.Absender || "Anonym"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button / Action */}
      <div className="flex mt-20 flex-col items-center">
        <button
          className="px-10 py-4 bg-white text-black rounded-full hover:bg-yellow-500 transition-colors focus:ring-2 focus:ring-yellow-300"
          tabIndex={tabIndexValue}
          onClick={() => window.history.back()}
        >
          <span className="font-bold text-xl">Zurück zur Übersicht</span>
        </button>
      </div>
    </div>
  );
}