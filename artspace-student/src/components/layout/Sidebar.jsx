
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  ClipboardList,
  Music2,
  Bell,
  UserRound,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: CalendarDays,
  },
  {
    label: "New Booking",
    path: "/book",
    icon: PlusCircle,
  },
  {
    label: "My Bookings",
    path: "/bookings",
    icon: ClipboardList,
  },
  {
    label: "University Events",
    path: "/events",
    icon: Music2,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
];

export default function Sidebar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950 text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 md:flex-nowrap md:gap-5 lg:px-8">
        <div className="flex items-center gap-4 md:shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Music2 size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">ArtSpace</h1>
              <p className="text-xs text-slate-400">Student Portal</p>
            </div>
          </div>
        </div>

        <nav aria-label="Primary navigation" className="order-3 -mx-4 flex basis-full min-w-0 gap-1 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:order-none md:mx-0 md:basis-auto md:flex-1 md:justify-center md:pb-0 lg:px-0">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5
                 text-sm font-medium transition-colors
                 ${
                   isActive
                     ? "bg-blue-600 text-white"
                     : "text-slate-300 hover:bg-white/10 hover:text-white"
                 }`
              }
            >
              <Icon aria-hidden="true" size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/profile"
          aria-label="Student account and profile"
          className={({ isActive }) =>
            `order-2 ml-auto flex shrink-0 items-center gap-2 rounded-lg p-2 transition-colors sm:px-3 md:order-none ${
              isActive ? "bg-blue-600" : "hover:bg-white/10"
            }`
          }
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
            <UserRound size={17} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">Student Account</p>
            <p className="text-xs text-slate-400">View Profile</p>
          </div>
        </NavLink>
      </div>
    </header>
  );
}
