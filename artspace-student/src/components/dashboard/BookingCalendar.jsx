
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();

  // Convert Sunday-first indexing to Monday-first.
  const startingDay = (firstDay.getDay() + 6) % 7;

  const today = new Date();

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const calendarDays = [
    ...Array(startingDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    ),
  ];

  // Complete the final calendar row.
  const remainingCells =
    (7 - (calendarDays.length % 7)) % 7;

  const fullCalendarDays = [
    ...calendarDays,
    ...Array(remainingCells).fill(null),
  ];

  return (
    <div className="panel p-4 md:p-5 h-full flex flex-col">

      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">

        <div>
          <h2 className="section-title">
            Booking Calendar
          </h2>

          <p className="text-xs muted mt-1">
            Art Center availability
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-1">

          <button
            type="button"
            onClick={previousMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="text-xs sm:text-sm font-semibold min-w-[112px] text-center">
            {currentDate.toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </span>

          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={17} />
          </button>

        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">

        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={`
              text-center text-[11px]
              font-semibold py-1 rounded-md
              ${
                day === "Wed"
                  ? "bg-red-100 text-red-700"
                  : "text-slate-500"
              }
            `}
          >
            {day}
          </div>
        ))}

      </div>

      {/* Calendar Dates */}
      <div className="grid grid-cols-7 gap-1">

        {fullCalendarDays.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="h-8 sm:h-9"
              />
            );
          }

          const date = new Date(
            year,
            month,
            day
          );

          const isWednesday =
            date.getDay() === 3;

          const selectedToday =
            isToday(day);

          const isPast =
            new Date(
              year,
              month,
              day
            ).setHours(0, 0, 0, 0) <
            new Date().setHours(0, 0, 0, 0);

          return (
            <div
              key={`${year}-${month}-${day}`}
              title={
                isWednesday
                  ? "Unavailable - Lecturer Practice"
                  : isPast
                  ? "Past date"
                  : "Booking date"
              }
              aria-label={
                `${date.toDateString()} - ${
                  isWednesday
                    ? "Unavailable: Lecturer Practice"
                    : isPast
                    ? "Past date"
                    : "Booking date"
                }`
              }
              className={`
                h-8 sm:h-9
                rounded-lg
                flex items-center justify-center
                text-xs font-medium
                border transition-colors

                ${
                  isWednesday
                    ? "bg-red-100 text-red-700 border-red-200 cursor-not-allowed"
                    : isPast
                    ? "bg-slate-50 text-slate-400 border-slate-100"
                    : "bg-white text-slate-700 border-slate-100 hover:bg-blue-50"
                }

                ${
                  selectedToday && !isWednesday
                    ? "ring-2 ring-blue-500"
                    : ""
                }
              `}
            >
              {day}
            </div>
          );
        })}

      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-slate-100">

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-white border border-slate-300" />

          <span className="text-[11px] muted">
            Booking dates
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-200" />

          <span className="text-[11px] muted">
            Wednesday - Unavailable
          </span>
        </div>

      </div>

      {/* Wednesday Notice */}
      <div className="mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">

        <CalendarDays
          size={16}
          className="text-red-600 shrink-0 mt-0.5"
        />

        <p className="text-[11px] text-red-700 leading-relaxed">
          <strong>Notice:</strong> Every Wednesday is reserved
          for lecturer practice. Student bookings are
          not allowed.
        </p>

      </div>
    </div>
  );
}
