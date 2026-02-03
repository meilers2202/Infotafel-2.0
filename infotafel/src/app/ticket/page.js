"use client";
import Ticket from "../components/ticket";

export default function TicketPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hier wird deine vorhandene ticket.js geladen */}
      <Ticket isActive={true} />
    </main>
  );
}