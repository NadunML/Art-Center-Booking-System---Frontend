import { CalendarDays, Clock3, Music2 } from 'lucide-react';
import { events } from '../data/mockData';

const dateParts = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: '2-digit',
	weekday: 'short',
	timeZone: 'UTC',
});

export default function Events() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">University Events</h1>
				<p className="muted mt-2">Art Center events scheduled by the university.</p>
			</div>

			<section aria-label="Upcoming university events" className="panel overflow-hidden">
				<div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
					<div>
						<h2 className="font-semibold text-neutral-900">Upcoming events</h2>
						<p className="muted mt-1 text-sm">Your university arts calendar</p>
					</div>
					<span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
						{events.length} {events.length === 1 ? 'event' : 'events'}
					</span>
				</div>

				<ul className="divide-y divide-neutral-200">
					{events.map((event) => {
						const eventDate = new Date(`${event.date}T00:00:00Z`);
						const [weekday, month, day] = dateParts.format(eventDate).replace(',', '').split(' ');

						return (
							<li className="flex items-center gap-4 px-5 py-5 sm:gap-6 sm:px-6" key={event.title}>
								<time
									className="flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50"
									dateTime={event.date}
								>
									<span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{month}</span>
									<span className="text-2xl font-bold leading-7 text-neutral-900">{day}</span>
								</time>

								<div className="min-w-0 flex-1">
									<p className="mb-1 text-sm font-medium text-neutral-500">{weekday}, {event.date.slice(0, 4)}</p>
									<h3 className="break-words font-semibold text-neutral-900 sm:text-lg">{event.title}</h3>
									<p className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
										<Clock3 aria-hidden="true" className="h-4 w-4 shrink-0" />
										<span>{event.time}</span>
									</p>
								</div>

								<div aria-hidden="true" className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 sm:flex">
									{event.time === 'All day' ? <CalendarDays className="h-5 w-5" /> : <Music2 className="h-5 w-5" />}
								</div>
							</li>
						);
					})}
				</ul>
			</section>
		</div>
	);
}
