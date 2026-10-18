
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEDNESDAY = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_RANGE_DAYS = 365;

const initialForm = {
  eventName: "",
  eventDate: "",
  practiceStart: "",
  practiceEnd: "",
  schedule: "daily",
  selectedDays: [],
  startTime: "14:00",
  durationType: "fixed",
  fixedHours: "2",
  endTime: "16:00",
  purpose: "",
  groupName: "",
  details: "",
};

function parseDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPracticeDates(start, end, schedule, selectedDays) {
  if (!start || !end || start > end) return [];

  const firstDate = parseDate(start);
  const lastDate = parseDate(end);

  if (
    !firstDate ||
    !lastDate ||
    (lastDate - firstDate) / 86400000 > MAX_RANGE_DAYS
  ) {
    return [];
  }

  const dates = [];
  const current = new Date(firstDate);

  while (current <= lastDate) {
    const weekday = current.getUTCDay();

    // Wednesday is reserved for lecturer practice.
    if (weekday !== WEDNESDAY) {
      const isSelected =
        schedule === "daily" || selectedDays.includes(weekday);

      if (isSelected) {
        dates.push(current.toISOString().slice(0, 10));
      }
    }

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

function getEndTime(startTime, hours) {
  if (!startTime) return "";

  const [hour, minute] = startTime.split(":").map(Number);
  const total = hour * 60 + minute + Number(hours) * 60;

  if (total > 1440) return "";

  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60
  ).padStart(2, "0")}`;
}

function getWednesdayCount(start, end) {
  if (!start || !end || start > end) return 0;

  const first = parseDate(start);
  const last = parseDate(end);

  if ((last - first) / 86400000 > MAX_RANGE_DAYS) return 0;

  let count = 0;
  const current = new Date(first);

  while (current <= last) {
    if (current.getUTCDay() === WEDNESDAY) count++;
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return count;
}

export default function NewBooking() {
  const [form, setForm] = useState(initialForm);
  const [permissionFile, setPermissionFile] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const today = getTodayString();

  const update = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const practiceDates = useMemo(
    () =>
      getPracticeDates(
        form.practiceStart,
        form.practiceEnd,
        form.schedule,
        form.selectedDays
      ),
    [
      form.practiceStart,
      form.practiceEnd,
      form.schedule,
      form.selectedDays,
    ]
  );

  const excludedWednesdays = useMemo(
    () => getWednesdayCount(form.practiceStart, form.practiceEnd),
    [form.practiceStart, form.practiceEnd]
  );

  const calculatedEnd =
    form.durationType === "fixed"
      ? getEndTime(form.startTime, form.fixedHours)
      : form.endTime;

  const toggleDay = (day) => {
    if (day === WEDNESDAY) return;

    setForm((previous) => ({
      ...previous,
      selectedDays: previous.selectedDays.includes(day)
        ? previous.selectedDays.filter((d) => d !== day)
        : [...previous.selectedDays, day],
    }));

    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setPermissionFile(null);

    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a valid PDF permission letter.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Permission letter must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setPermissionFile(file);
  };

  const removeFile = () => {
    setPermissionFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.eventName.trim() || !form.purpose.trim()) {
      setError("Please enter the event name and practice purpose.");
      return;
    }

    if (!form.eventDate || !form.practiceStart || !form.practiceEnd) {
      setError("Please select the event date and practice dates.");
      return;
    }

    if (form.eventDate < today || form.practiceStart < today) {
      setError("Event and practice dates cannot be in the past.");
      return;
    }

    if (form.practiceStart > form.practiceEnd) {
      setError("Practice end date cannot be before the start date.");
      return;
    }

    if (form.practiceEnd > form.eventDate) {
      setError("Practice cannot end after the event date.");
      return;
    }

    const rangeDays =
      (parseDate(form.practiceEnd) - parseDate(form.practiceStart)) /
      86400000;

    if (rangeDays > MAX_RANGE_DAYS) {
      setError("Practice date range cannot exceed 365 days.");
      return;
    }

    if (practiceDates.length === 0) {
      setError(
        "No valid practice dates selected. Wednesdays are unavailable."
      );
      return;
    }

    if (
      !form.startTime ||
      !calculatedEnd ||
      calculatedEnd <= form.startTime
    ) {
      setError("Please select valid practice start and end times.");
      return;
    }

    if (!permissionFile) {
      setError("Please upload your permission letter in PDF format.");
      return;
    }

    // Frontend demonstration only.
    // Connect a backend API here to save the booking and upload the PDF.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="panel p-8 text-center space-y-5">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto" />

          <h1 className="text-2xl font-bold">
            Booking Preview Complete
          </h1>

          <p className="muted">
            Your request passed frontend validation.
            It has not been submitted to the admin yet.
          </p>

          <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3">
            <p>
              <strong>Event:</strong> {form.eventName}
            </p>

            <p>
              <strong>Event Date:</strong> {form.eventDate}
            </p>

            <p>
              <strong>Practice Period:</strong> {form.practiceStart}
              {" to "}{form.practiceEnd}
            </p>

            <p>
              <strong>Practice Sessions:</strong> {practiceDates.length}
            </p>

            <p>
              <strong>Excluded Wednesdays:</strong> {excludedWednesdays}
            </p>

            <p>
              <strong>Daily Practice Time:</strong> {form.startTime}
              {" – "}{calculatedEnd}
            </p>

            <p>
              <strong>Practice Purpose:</strong> {form.purpose}
            </p>

            <p>
              <strong>Permission Letter:</strong> {permissionFile.name}
            </p>

            <p>
              <strong>Status:</strong> Demo Preview
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="primary-btn"
              onClick={() => setSubmitted(false)}
            >
              Edit Request
            </button>

            <Link to="/" className="field w-auto">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold">
          New Booking Request
        </h1>

        <p className="muted mt-2">
          Request the Art Center for your event practice sessions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Event Information */}
        <section className="panel p-6 space-y-5">
          <h2 className="section-title flex items-center gap-2">
            <CalendarDays className="text-blue-600" size={20} />
            Event Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-semibold">
              Event Name *
              <input
                className="field mt-2"
                placeholder="e.g. Annual Music Festival"
                value={form.eventName}
                onChange={(e) =>
                  update("eventName", e.target.value)
                }
                required
              />
            </label>

            <label className="text-sm font-semibold">
              Event Date *
              <input
                className="field mt-2"
                type="date"
                min={today}
                value={form.eventDate}
                onChange={(e) =>
                  update("eventDate", e.target.value)
                }
                required
              />
            </label>
          </div>
        </section>

        {/* Practice Schedule */}
        <section className="panel p-6 space-y-5">
          <h2 className="section-title flex items-center gap-2">
            <Clock3 className="text-blue-600" size={20} />
            Practice Schedule
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertCircle
              className="text-red-600 shrink-0"
              size={20}
            />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Wednesday Booking Restriction
              </p>

              <p className="text-xs text-red-700 mt-1">
                Every Wednesday is reserved for lecturer practice.
                Student bookings are not allowed on Wednesdays.
                These dates will be automatically excluded.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-semibold">
              Practice Start Date *
              <input
                className="field mt-2"
                type="date"
                min={today}
                max={form.eventDate || undefined}
                value={form.practiceStart}
                onChange={(e) =>
                  update("practiceStart", e.target.value)
                }
                required
              />
            </label>

            <label className="text-sm font-semibold">
              Practice End Date *
              <input
                className="field mt-2"
                type="date"
                min={form.practiceStart || today}
                max={form.eventDate || undefined}
                value={form.practiceEnd}
                onChange={(e) =>
                  update("practiceEnd", e.target.value)
                }
                required
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">
              Practice Frequency
            </p>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={form.schedule === "daily"}
                  onChange={() => update("schedule", "daily")}
                />
                Every Available Day
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={form.schedule === "selected"}
                  onChange={() => update("schedule", "selected")}
                />
                Selected Weekdays
              </label>
            </div>
          </div>

          {form.schedule === "selected" && (
            <div className="space-y-3">
              <p className="text-xs muted">
                Choose the weekdays for your practice sessions.
              </p>

              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day, index) => {
                  const isWednesday = index === WEDNESDAY;
                  const isSelected =
                    form.selectedDays.includes(index);

                  return (
                    <button
                      type="button"
                      key={day}
                      disabled={isWednesday}
                      onClick={() => toggleDay(index)}
                      title={
                        isWednesday
                          ? "Unavailable - Lecturer Practice"
                          : `Select ${day}`
                      }
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        isWednesday
                          ? "bg-red-100 text-red-500 border-red-200 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-slate-300 hover:bg-blue-50"
                      }`}
                    >
                      {day}
                      {isWednesday && " ✕"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold mb-3">
              Practice Duration
            </p>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={form.durationType === "fixed"}
                  onChange={() =>
                    update("durationType", "fixed")
                  }
                />
                Fixed Duration
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={form.durationType === "custom"}
                  onChange={() =>
                    update("durationType", "custom")
                  }
                />
                Custom Duration
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-semibold">
              Daily Start Time *
              <input
                className="field mt-2"
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  update("startTime", e.target.value)
                }
                required
              />
            </label>

            {form.durationType === "fixed" ? (
              <label className="text-sm font-semibold">
                Duration *
                <select
                  className="field mt-2"
                  value={form.fixedHours}
                  onChange={(e) =>
                    update("fixedHours", e.target.value)
                  }
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                </select>
              </label>
            ) : (
              <label className="text-sm font-semibold">
                Daily End Time *
                <input
                  className="field mt-2"
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    update("endTime", e.target.value)
                  }
                  required
                />
              </label>
            )}
          </div>

          {/* Schedule Preview */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
            <p className="font-semibold text-blue-900">
              Practice Schedule Preview
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-slate-500">
                  Practice Sessions
                </p>
                <p className="text-xl font-bold text-blue-700">
                  {practiceDates.length}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-slate-500">
                  Wednesdays Excluded
                </p>
                <p className="text-xl font-bold text-red-600">
                  {excludedWednesdays}
                </p>
              </div>
            </div>

            <p className="text-sm text-blue-800">
              Daily Time: {form.startTime} –{" "}
              {calculatedEnd || "Invalid end time"}
            </p>

            <div className="flex flex-wrap gap-2">
              {practiceDates.slice(0, 20).map((date) => (
                <span
                  key={date}
                  className="bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs"
                >
                  {date}
                </span>
              ))}

              {practiceDates.length > 20 && (
                <span className="text-xs text-blue-700 self-center">
                  +{practiceDates.length - 20} more dates
                </span>
              )}
            </div>

            {excludedWednesdays > 0 && (
              <p className="text-xs text-red-700">
                Wednesday dates have been automatically removed
                from your requested practice schedule.
              </p>
            )}
          </div>
        </section>

        {/* Practice Details */}
        <section className="panel p-6 space-y-5">
          <h2 className="section-title flex items-center gap-2">
            <FileText className="text-blue-600" size={20} />
            Practice Details
          </h2>

          <label className="block text-sm font-semibold">
            Practice Purpose *
            <input
              className="field mt-2"
              placeholder="e.g. Band rehearsal for annual concert"
              value={form.purpose}
              onChange={(e) =>
                update("purpose", e.target.value)
              }
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Group / Society Name
            <input
              className="field mt-2"
              placeholder="e.g. University Music Society"
              value={form.groupName}
              onChange={(e) =>
                update("groupName", e.target.value)
              }
            />
          </label>

          <label className="block text-sm font-semibold">
            Additional Details
            <textarea
              className="field mt-2"
              rows={3}
              placeholder="Additional information..."
              value={form.details}
              onChange={(e) =>
                update("details", e.target.value)
              }
            />
          </label>
        </section>

        {/* Permission Letter */}
        <section className="panel p-6 space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <UploadCloud
              className="text-blue-600"
              size={20}
            />
            Permission Letter
          </h2>

          <p className="text-sm muted">
            Upload your university permission letter.
            PDF only, maximum 5 MB.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="field"
            required={!permissionFile}
          />

          {permissionFile && (
            <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="text-green-700 shrink-0" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {permissionFile.name}
                  </p>

                  <p className="text-xs text-green-700">
                    {(permissionFile.size / 1024 / 1024).toFixed(2)}
                    {" MB"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                aria-label="Remove permission letter"
                className="text-slate-500 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </section>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm muted">
            All booking requests require admin approval.
          </p>

          <button type="submit" className="primary-btn">
            Preview Booking Request
          </button>
        </div>
      </form>
    </div>
  );
}
