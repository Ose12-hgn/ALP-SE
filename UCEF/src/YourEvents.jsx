import { useEffect, useState } from 'react'

const EVENTS_STORAGE_KEY = 'UCEF_localEvents'

const seedEvents = [
  {
    id: 'event-1',
    title: 'Tech Career Fair 2026',
    date: 'March 15, 2026',
    students: [
      { id: 's-1', studentName: 'Ahmad Pratama', studentNumber: '00000123456', present: true },
      { id: 's-2', studentName: 'Siti Nurhaliza', studentNumber: '00000123457', present: false }
    ]
  },
  {
    id: 'event-2',
    title: 'Startup Networking Event',
    date: 'April 10, 2026',
    students: [
      { id: 's-3', studentName: 'Dewi Lestari', studentNumber: '00000123459', present: true }
    ]
  }
]

function loadEvents() {
  if (typeof window === 'undefined') return seedEvents
  try {
    const saved = window.localStorage.getItem(EVENTS_STORAGE_KEY)
    if (!saved) return seedEvents
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedEvents
  } catch {
    return seedEvents
  }
}

export default function YourEvents() {
  const [events, setEvents] = useState(loadEvents)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
    } catch {}
  }, [events])

  const selectedEvent = events.find((event) => event.id === selectedEventId) || null

  function handleAddStudent(e) {
    e.preventDefault()
    if (!selectedEvent || !studentName.trim() || !studentNumber.trim()) return

    const newStudent = {
      id: `student-${Date.now()}`,
      studentName: studentName.trim(),
      studentNumber: studentNumber.trim(),
      present: false
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, students: [...event.students, newStudent] }
          : event
      )
    )
    setStudentName('')
    setStudentNumber('')
  }

  function toggleAttendance(studentId) {
    if (!selectedEvent) return

    setEvents((currentEvents) =>
      currentEvents.map((event) => {
        if (event.id !== selectedEvent.id) return event
        return {
          ...event,
          students: event.students.map((student) =>
            student.id === studentId ? { ...student, present: !student.present } : student
          )
        }
      })
    )
  }

  if (!selectedEvent) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Events</h2>
        <p className="text-sm text-gray-500 mb-4">Stored locally on this device.</p>
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50 bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-xs text-gray-400 mt-1">{event.students.length} students</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <button
        onClick={() => setSelectedEventId(null)}
        className="mb-4 text-blue-500 hover:underline flex items-center"
      >
        ← Back to Your Events
      </button>

      <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
      <p className="text-gray-600 mb-6">{selectedEvent.date}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Add Student Manually</h3>
          <form onSubmit={handleAddStudent} className="space-y-3 border p-4 rounded bg-gray-50">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2 border rounded bg-white"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Student Number</label>
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="w-full p-2 border rounded bg-white"
                placeholder="Enter student ID number"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700"
            >
              Add Student to Event
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Attendance Checklist</h3>
          <div className="space-y-2 border p-4 rounded bg-gray-50 max-h-96 overflow-y-auto">
            {selectedEvent.students.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No students added yet.</p>
            ) : (
              selectedEvent.students.map((student) => (
                <div key={student.id} className="flex justify-between items-center p-3 border rounded bg-white shadow-sm">
                  <div>
                    <p className="font-semibold">{student.studentName}</p>
                    <p className="text-xs text-gray-500">ID: {student.studentNumber}</p>
                  </div>
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      student.present
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {student.present ? '✓ Present' : 'Mark Present'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}