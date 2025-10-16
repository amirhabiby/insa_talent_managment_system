"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "Lorem ipsum",
    time: "12:00 - 2:00",
    description: "Admin dashboard meaning only Admin can acess",
  },
  {
    id: 2,
    title: "Lorem ipsum",
    time: "10:00 - 2:00",
    description: "Event check two",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4 text-darkblue">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-ghostwhite border-t-4 odd:border-t-pinky even:border-t-blue "
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-darkblue">{event.title}</h1>
              <span className="text-fadedblue text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-darkblue text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
