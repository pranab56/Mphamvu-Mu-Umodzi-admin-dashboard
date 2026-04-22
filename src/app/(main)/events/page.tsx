import { EventHeader } from "@/components/events/EventHeader";
import { EventStats } from "@/components/events/EventStats";
import { EventTypes } from "@/components/events/EventTypes";
import { EventSection } from "@/components/events/EventTable";

export default function EventsPage() {
  const activeEvents = Array(5).fill({
    id: "1",
    name: "Support for Banda Family",
    date: "Apr 2, 2026",
    type: "Funeral",
    targetAmount: "$ 12,250",
    collected: "$ 9,250",
    participation: "94%",
    deadline: "Apr 10, 2026",
  }).map((e, i) => ({ ...e, id: String(i) }));

  const completedEvents = Array(4).fill({
    id: "c1",
    name: "Support for Banda Family",
    date: "Apr 2, 2026",
    type: "Funeral",
    collected: "$ 9,250",
    participation: "100%",
    completedAt: "Apr 10, 2026",
  }).map((e, i) => ({ ...e, id: `c-${i}` }));

  return (
    <div className="space-y-6">
      <EventHeader />
      <EventStats />
      <EventTypes />
      
      <EventSection 
        title="Active Events" 
        events={activeEvents} 
        type="active" 
      />
      
      <EventSection 
        title="Completed Events" 
        events={completedEvents} 
        type="completed" 
      />
    </div>
  );
}
