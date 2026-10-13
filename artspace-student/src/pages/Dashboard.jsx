
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  Music2,
  Plus,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import BookingCalendar from "../components/dashboard/BookingCalendar";
import { bookings, events } from "../data/mockData";

export default function Dashboard() {
  const myBookings = bookings.length;

  const myPendingRequests = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);

      return (
        !Number.isNaN(eventDate.getTime()) &&
        eventDate >= today &&
        eventDate < twoMonthsLater
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="w-full space-y-5">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, Student!
          </h1>
          <p className="muted mt-1">
            Here's what's happening at your Art Center.
          </p>
        </div>

        <Link to="/book" className="primary-btn">
          <Plus size={18} />
          New Booking
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="My Bookings"
          value={myBookings}
          Icon={CalendarCheck2}
        />

        <StatCard
          title="My Pending Requests"
          value={myPendingRequests}
          Icon={Clock3}
          accent="amber"
        />

        <StatCard
          title="Events in Next 2 Months"
          value={upcomingEvents.length}
          Icon={CalendarDays}
          accent="green"
        />
      </div>

      {/* Equal-height Calendar and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch lg:h-[min(540px,calc(100vh-265px))] lg:min-h-[370px]">
        {/* Booking Calendar */}
        <div className="min-w-0 h-full">
          <BookingCalendar />
        </div>

        {/* University Events */}
        <div className="panel p-4 md:p-5 min-w-0 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h2 className="section-title">
                University Events
              </h2>
              <p className="text-xs muted mt-1">
                Upcoming university events
              </p>
            </div>

            <Link
              to="/events"
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
              aria-label="View all university events"
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {upcomingEvents.length === 0 ? (
              <div className="h-full min-h-32 flex flex-col items-center justify-center text-center">
                <CalendarDays
                  size={30}
                  className="text-slate-400 mb-2"
                />
                <p className="text-sm muted">
                  No upcoming events in the next two months.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={`${event.title}-${index}`}
                    className="flex items-start gap-3 py-3"
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                      <Music2 size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {event.title}
                      </h3>
                      <p className="text-xs muted mt-1">
                        {event.date} · {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
