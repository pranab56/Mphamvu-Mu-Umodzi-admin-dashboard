import { EventHeader } from "@/components/events/EventHeader";
import { EventStats } from "@/components/events/EventStats";
import { EventTypes } from "@/components/events/EventTypes";
import { EventSection } from "@/components/events/EventTable";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <EventHeader />
      <EventStats />
      <EventTypes />
      
      <EventSection 
        title="Active Events" 
        type="active" 
      />
      
      <EventSection 
        title="Completed Events" 
        type="completed" 
      />
    </div>
  );
}
