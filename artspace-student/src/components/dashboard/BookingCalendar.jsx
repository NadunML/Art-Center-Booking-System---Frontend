import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarHighlights } from '../../data/mockData';

const busy = { 15: 'approved', 18: 'pending', 22: 'event', 25: 'event' };
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function BookingCalendar() {
	const [offset, setOffset] = useState(0);
	const [selected, setSelected] = useState(null);
	const month = new Date(2026, 9 + offset, 1);
	const year = month.getFullYear();
	const monthIndex = month.getMonth();
	const dayCount = new Date(year, monthIndex + 1, 0).getDate();
	const firstWeekday = (month.getDay() + 6) % 7;
	const cells = Array.from(
		{ length: Math.ceil((firstWeekday + dayCount) / 7) * 7 },
		(_, index) => {
			const day = index - firstWeekday + 1;
			return day > 0 && day <= dayCount ? day : null;
		},
	);

	const selectedDate = selected
		? `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(selected).padStart(2, '0')}`
		: null;
	const selectedHighlight = calendarHighlights.find(
		(highlight) =>
			highlight.date === selectedDate ||
			(highlight.startDate &&
				highlight.startDate <= selectedDate &&
				highlight.endDate >= selectedDate),
	);

	function getDayHighlight(day) {
		const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return calendarHighlights.find(
			(highlight) =>
				highlight.date === date ||
				(highlight.startDate &&
					highlight.startDate <= date &&
					highlight.endDate >= date),
		);
	}

	function getDayClass(day, highlight) {
		if (!day) return 'opacity-0';
		if (highlight?.type === 'practice') return 'bg-slate-700 text-white hover:bg-slate-800';
		if (highlight?.type === 'ieee-day') return 'bg-red-600 text-white hover:bg-red-700';
		if (offset === 0 && busy[day] === 'approved') return 'bg-red-50 text-red-700';
		if (offset === 0 && busy[day] === 'pending') return 'bg-amber-50 text-amber-700';
		if (offset === 0 && busy[day] === 'event') return 'bg-purple-50 text-purple-700';
		return 'bg-slate-50 hover:bg-blue-50';
	}

	return (
		<div className="panel p-5 md:p-6">
			<div className="flex items-center justify-between mb-5">
				<h2 className="section-title">Booking Calendar</h2>
				<div className="flex items-center gap-3">
					<button
						aria-label="Previous month"
						onClick={() => {
							setOffset((value) => value - 1);
							setSelected(null);
						}}
					>
						<ChevronLeft size={18} />
					</button>
					<span className="font-semibold text-sm min-w-28 text-center">
						{month.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
					</span>
					<button
						aria-label="Next month"
						onClick={() => {
							setOffset((value) => value + 1);
							setSelected(null);
						}}
					>
						<ChevronRight size={18} />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-1.5">
				{weekdays.map((weekday) => (
					<div
						key={weekday}
						className="text-center text-xs text-slate-400 font-semibold py-2"
					>
						{weekday}
					</div>
				))}
				{cells.map((day, index) => {
					const highlight = day ? getDayHighlight(day) : null;
					return (
						<button
							key={index}
							disabled={!day}
							onClick={() => setSelected(day)}
							title={highlight?.title}
							aria-label={day ? `${day}${highlight ? `, ${highlight.title}` : ''}` : undefined}
							className={`h-10 md:h-12 rounded-lg text-sm font-medium ${getDayClass(day, highlight)} ${selected === day ? 'ring-2 ring-blue-600 ring-offset-1' : ''}`}
						>
							{day}
						</button>
					);
				})}
			</div>

			<div className="flex flex-wrap gap-4 text-xs muted mt-5">
				{[
					['bg-slate-200', 'Available / not checked'],
					['bg-slate-700', 'Art Center Practice'],
					['bg-red-600', 'IEEE Day'],
					['bg-red-400', 'Booked'],
					['bg-amber-400', 'Pending'],
					['bg-purple-400', 'Event'],
				].map(([color, label]) => (
					<span key={label} className="flex items-center gap-1.5">
						<i className={`w-2.5 h-2.5 rounded-full ${color}`} />
						{label}
					</span>
				))}
			</div>

			{selected && (
				<p className="mt-4 text-sm text-blue-700">
					Selected: {selectedDate}
					{selectedHighlight ? ` · ${selectedHighlight.title}` : ''}. Open New
					Booking to request a time.
				</p>
			)}
			<p className="text-xs muted mt-3">
				Illustrative dates only. Real availability requires the backend.
			</p>
		</div>
	);
}
