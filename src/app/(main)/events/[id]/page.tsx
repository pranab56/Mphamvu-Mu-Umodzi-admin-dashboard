"use client";

import { use } from "react";
import { EventDetailsHeader } from "@/components/events/EventDetailsHeader";
import { EventDetailsTabs } from "@/components/events/EventDetailsTabs";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <EventDetailsHeader eventId={id} />
      <EventDetailsTabs eventId={id} />
    </div>
  );
}
