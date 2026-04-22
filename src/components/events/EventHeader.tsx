"use client";

import { AddEventSheet } from "./AddEventSheet";

export function EventHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Event Management</h1>
        <p className="text-base text-gray-500 mt-1">145 total events</p>
      </div>
      <AddEventSheet />
    </div>
  );
}

