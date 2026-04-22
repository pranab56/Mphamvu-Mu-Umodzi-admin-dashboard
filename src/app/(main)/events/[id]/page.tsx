import { EventDetailsHeader } from "@/components/events/EventDetailsHeader";
import { EventDetailsTabs } from "@/components/events/EventDetailsTabs";

export default function EventDetailsPage() {
  return (
    <div className="space-y-6">
      <EventDetailsHeader />
      <EventDetailsTabs />
    </div>
  );
}
