import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore'
import { db } from './firebaseConfig'

export default function YourEvents() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [students, setStudents] = useState([])
  const [studentName, setStudentName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')

  useEffect(() => {
    async function fetchEvents() {
      const querySnapshot = await getDocs(collection(db, 'events'))
      const eventData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setEvents(eventData)
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (!selectedEvent) return

    async function fetchStudents() {
      const q = query(collection(db, 'attendance'), where('eventId', '==', selectedEvent.id))
      const querySnapshot = await getDocs(q)
      const studentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setStudents(studentData)
    }
    fetchStudents()
  }, [selectedEvent])

  async function handleAddStudent(e) {
    e.preventDefault()
    if (!studentName || !studentNumber) return

    const newStudent = {
      eventId: selectedEvent.id,
      studentName: studentName,
      studentNumber: studentNumber,
      present: false
    }

    const docRef = await addDoc(collection(db, 'attendance'), newStudent)
    setStudents([...students, { id: docRef.id, ...newStudent }])
    setStudentName('')
    setStudentNumber('')
  }

  async function toggleAttendance(studentId, currentStatus) {
    const studentRef = doc(db, 'attendance', studentId)
    await updateDoc(studentRef, { present: !currentStatus })
    
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, present: !currentStatus } : student
    ))
  }

  if (!selectedEvent) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Events</h2>
        <div className="space-y-2">
          {events.map(event => (
            <div 
              key={event.id} 
              onClick={() => setSelectedEvent(event)}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50 bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <button 
        onClick={() => setSelectedEvent(null)}
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
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No students added yet.</p>
            ) : (
              students.map(student => (
                <div key={student.id} className="flex justify-between items-center p-3 border rounded bg-white shadow-sm">
                  <div>
                    <p className="font-semibold">{student.studentName}</p>
                    <p className="text-xs text-gray-500">ID: {student.studentNumber}</p>
                  </div>
                  <button 
                    onClick={() => toggleAttendance(student.id, student.present)}
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