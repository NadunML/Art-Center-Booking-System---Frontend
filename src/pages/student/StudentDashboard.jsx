import React, { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const StudentDashboard = () => {
  // Sample Bookings Data Structure
  const [events] = useState([
    {
      id: '1',
      title: 'Drama Practice - Computing',
      start: '2026-10-01T10:00:00',
      end: '2026-10-01T13:00:00',
      backgroundColor: '#3b82f6',
      extendedProps: {
        faculty: 'Faculty of Computing',
        organizer: 'Kasun Perera',
        contact: '0712345678',
      },
    },
    {
      id: '2',
      title: 'Music Club Practice - Applied',
      start: '2026-10-02T14:00:00',
      end: '2026-10-02T17:00:00',
      backgroundColor: '#10b981',
      extendedProps: {
        faculty: 'Faculty of Applied Sciences',
        organizer: 'Nimali Silva',
        contact: '0778901234',
      },
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  // Click Event Handler
  const handleEventClick = (info) => {
    setSelectedEvent({
      title: info.event.title,
      start: info.event.start
        ? info.event.start.toLocaleString()
        : 'N/A',
      end: info.event.end
        ? info.event.end.toLocaleString()
        : 'N/A',
      faculty: info.event.extendedProps.faculty,
      organizer: info.event.extendedProps.organizer,
      contact: info.event.extendedProps.contact,
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Dashboard</h1>

      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
      />

      {selectedEvent && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h2>Booking Details</h2>

          <p>
            <strong>Event:</strong> {selectedEvent.title}
          </p>

          <p>
            <strong>Start:</strong> {selectedEvent.start}
          </p>

          <p>
            <strong>End:</strong> {selectedEvent.end}
          </p>

          <p>
            <strong>Faculty:</strong> {selectedEvent.faculty}
          </p>

          <p>
            <strong>Organizer:</strong> {selectedEvent.organizer}
          </p>

          <p>
            <strong>Contact:</strong> {selectedEvent.contact}
          </p>

          <button onClick={() => setSelectedEvent(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;