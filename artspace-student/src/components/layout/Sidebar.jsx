
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
    <aside className="w-full lg:w-64 lg:min-h-screen bg-slate-950 text-white flex flex-col lg:sticky lg:top-0 lg:h-screen">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Music2 size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              ArtSpace
            </h1>

            <p className="text-xs text-slate-400">
              Student Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl
               text-sm font-medium transition-colors
               ${
                 isActive
                   ? "bg-blue-600 text-white"
                   : "text-slate-300 hover:bg-white/10 hover:text-white"
               }`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Account */}
      <div className="p-3 border-t border-white/10">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-colors
             ${
               isActive
                 ? "bg-blue-600"
                 : "hover:bg-white/10"
             }`
          }
        >
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <UserRound size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">
              Student Account
            </p>

            <p className="text-xs text-slate-400 truncate">
              View Profile
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
