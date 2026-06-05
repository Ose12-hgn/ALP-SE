import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Calendar, Users, ChevronRight, Camera, X, CheckCircle2, ArrowLeft, Upload, FileText, CheckCheck, User, GraduationCap, Hash, Eye, EyeOff, Mail, Lock, Plus, QrCode, MapPin, AlertCircle, TrendingDown } from 'lucide-react';

type UserRole = 'student' | 'organizer' | null;

type SavedUser = {
  role: UserRole;
  email: string;
  password: string;
  name: string;
  studentNumber?: string;
  major?: string;
};

type PublishedEvent = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  attendees: number;
  applicants: Array<{
    id: number;
    name: string;
    studentNumber: string;
    major: string;
    status: 'pending' | 'accepted' | 'rejected';
    attended: boolean;
  }>;
};

const USERS_KEY = 'UCEF_users';
const CURRENT_USER_KEY = 'UCEF_currentUser';
const EVENTS_KEY = 'UCEF_publishedEvents';

const seedPublishedEvents: PublishedEvent[] = [
  {
    id: 1,
    title: 'Tech Career Fair 2026',
    date: 'March 15, 2026',
    location: 'Main Hall',
    description: 'Industry partners and student networking.',
    attendees: 45,
    applicants: [
      { id: 1, name: 'Ahmad Pratama', studentNumber: '00000123456', major: 'Information Systems', status: 'pending', attended: false },
      { id: 2, name: 'Siti Nurhaliza', studentNumber: '00000123457', major: 'Business', status: 'pending', attended: false },
      { id: 3, name: 'Budi Santoso', studentNumber: '00000123458', major: 'Computer Science', status: 'pending', attended: false }
    ]
  }
];

const seedAttendedEvents = [
  { title: 'SU IBM 24/25', date: 'December 15, 2024', type: 'Career Fair' },
  { title: 'KOOR PCD OWEEK 25/26', date: 'August 20, 2025', type: 'Orientation Week' }
];

function loadSavedUsers(): SavedUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadPublishedEvents(): PublishedEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : seedPublishedEvents;
  } catch {
    return seedPublishedEvents;
  }
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<SavedUser | null>(null);
  const [studentScreen, setStudentScreen] = useState(0);
  const [organizerScreen, setOrganizerScreen] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<PublishedEvent[]>([]);

  const handleLogin = (role: UserRole, user?: any) => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (user) {
      setCurrentUser(user);
    }
    // persist current user
    if (user) {
      try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)); } catch {}
    } else {
      try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ role })); } catch {}
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    setStudentScreen(0);
    setOrganizerScreen(0);
    try { localStorage.removeItem(CURRENT_USER_KEY); } catch {}
  };

  useEffect(() => {
    setPublishedEvents(loadPublishedEvents());
  }, []);

  useEffect(() => {
    try { localStorage.setItem(EVENTS_KEY, JSON.stringify(publishedEvents)); } catch {}
  }, [publishedEvents]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.role) {
          setUserRole(user.role);
          setIsLoggedIn(true);
          setCurrentUser(user);
        }
      }
    } catch {}
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[100dvh] bg-background overflow-hidden">
        <AuthScreen onLogin={handleLogin} />
      </div>
    );
  }

  if (userRole === 'organizer') {
    return (
      <div className="min-h-[100dvh] bg-background overflow-hidden">
        <OrganizerHomeScreen
          user={currentUser}
          screen={organizerScreen}
          onScreenChange={setOrganizerScreen}
          events={publishedEvents}
          onEventsChange={setPublishedEvents}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background overflow-hidden">
      <StudentHomeScreen
        user={currentUser}
        screen={studentScreen}
        onScreenChange={setStudentScreen}
        events={publishedEvents}
        onLogout={handleLogout}
      />
    </div>
  );
}

interface AuthScreenProps {
  onLogin: (role: UserRole, user?: any) => void;
}

function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    studentNumber: '',
    major: ''
  });

  const handleSubmit = () => {
    const users = JSON.parse(localStorage.getItem('UCEF_users') || '[]');
    if (isLogin) {
      const found = users.find((u: any) => u.email === formData.email && u.password === formData.password && u.role === selectedRole);
      if (found) {
        localStorage.setItem('UCEF_currentUser', JSON.stringify(found));
        onLogin(selectedRole, found);
      } else {
        alert('Invalid credentials for selected role');
      }
    } else {
      // register
      if (!formData.email || !formData.password || !formData.name) {
        alert('Please fill required fields');
        return;
      }
      const exists = users.find((u: any) => u.email === formData.email);
      if (exists) {
        alert('User with this email already exists');
        return;
      }
      const newUser = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        studentNumber: formData.studentNumber || '',
        major: formData.major || '',
        role: selectedRole
      };
      users.push(newUser);
      localStorage.setItem('UCEF_users', JSON.stringify(users));
      localStorage.setItem('UCEF_currentUser', JSON.stringify(newUser));
      onLogin(selectedRole, newUser);
    }
  };

  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="px-6 pt-20 pb-8">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(141, 212, 195, 0.2) 0%, rgba(255, 184, 148, 0.2) 100%)',
              border: '1px solid rgba(141, 212, 195, 0.3)'
            }}
          >
            <Calendar className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
          <h1
            className="text-4xl mb-2"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            UCEF
          </h1>
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
            }}
          >
            University Ciputra Event Finder
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <p
            className="text-sm mb-3 text-center"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              fontWeight: 500
            }}
          >
            I am a
          </p>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('student')}
              className="flex-1 p-4 rounded-2xl"
              style={{
                background: selectedRole === 'student'
                  ? 'rgba(141, 212, 195, 0.15)'
                  : 'transparent',
                border: selectedRole === 'student'
                  ? '2px solid rgba(141, 212, 195, 0.5)'
                  : '2px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <User className={`w-6 h-6 mx-auto mb-2 ${selectedRole === 'student' ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={2} />
              <span
                className={selectedRole === 'student' ? 'text-foreground' : 'text-muted-foreground'}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Student
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('organizer')}
              className="flex-1 p-4 rounded-2xl"
              style={{
                background: selectedRole === 'organizer'
                  ? 'rgba(255, 184, 148, 0.15)'
                  : 'transparent',
                border: selectedRole === 'organizer'
                  ? '2px solid rgba(255, 184, 148, 0.5)'
                  : '2px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <Users className={`w-6 h-6 mx-auto mb-2 ${selectedRole === 'organizer' ? 'text-secondary' : 'text-muted-foreground'}`} strokeWidth={2} />
              <span
                className={selectedRole === 'organizer' ? 'text-foreground' : 'text-muted-foreground'}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Organizer
              </span>
            </motion.button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
          <button
            onClick={() => setIsLogin(true)}
            className="flex-1 py-3 rounded-xl transition-all"
            style={{
              background: isLogin ? '#ffffff' : 'transparent',
              boxShadow: isLogin ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              fontWeight: 600
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className="flex-1 py-3 rounded-xl transition-all"
            style={{
              background: !isLogin ? '#ffffff' : 'transparent',
              boxShadow: !isLogin ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              fontWeight: 600
            }}
          >
            Register
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label
                className="block mb-2 text-sm"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                  fontWeight: 500
                }}
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
                  }}
                />
              </div>
            </div>
          )}

          {!isLogin && selectedRole === 'student' && (
            <div>
              <label
                className="block mb-2 text-sm"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                  fontWeight: 500
                }}
              >
                Student Number
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                  placeholder="00000123456"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
                  }}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label
                className="block mb-2 text-sm"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                  fontWeight: 500
                }}
              >
                Major
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="Enter your major"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              className="block mb-2 text-sm"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                fontWeight: 500
              }}
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@student.uc.ac.id"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
                }}
              />
            </div>
          </div>

          <div>
            <label
              className="block mb-2 text-sm"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                fontWeight: 500
              }}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl mt-8 text-white"
          style={{
            background: selectedRole === 'student' ? '#8dd4c3' : '#ffb894'
          }}
        >
          <span
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '17px'
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

interface EventDetails {
  title: string;
  description: string;
  color: 'primary' | 'secondary';
  requirements: string[];
  icon: React.ReactNode;
}

function AttendedEventsScreen() {
  const attendedEvents = [
    {
      title: "SU IBM 24/25",
      date: "December 15, 2024",
      type: "Career Fair"
    },
    {
      title: "KOOR PCD OWEEK 25/26",
      date: "August 20, 2025",
      type: "Orientation Week"
    }
  ];

  return (
    <div className="relative h-full bg-background overflow-y-auto">
      <div className="px-6 pt-16 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl tracking-tight mb-2"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}
          >
            Events Attended
          </h1>
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              fontSize: '15px'
            }}
          >
            Your participation history
          </p>
        </div>

        {/* Attended Events List */}
        <div className="space-y-4">
          {attendedEvents.map((event, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01, y: -2 }}
              className="relative overflow-hidden"
              style={{ borderRadius: '24px' }}
            >
              <div
                className="absolute inset-0 backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 213, 226, 0.15) 0%, rgba(168, 213, 226, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />

              <div className="relative p-6 flex items-center gap-5">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(168, 213, 226, 0.2)' }}
                >
                  <CheckCheck className="w-10 h-10 text-accent" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl mb-1"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                      fontWeight: 600,
                      color: '#1a1a1a'
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-sm opacity-70 mb-1"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                      color: '#1a1a1a'
                    }}
                  >
                    {event.type}
                  </p>
                  <p
                    className="text-xs opacity-50"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                      color: '#1a1a1a'
                    }}
                  >
                    {event.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DashboardScreenProps {
  onCameraClick: () => void;
  onLogout: () => void;
}

function DashboardScreen({ onCameraClick, onLogout }: DashboardScreenProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationEvent, setApplicationEvent] = useState<EventDetails | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const events: EventDetails[] = [
    {
      title: "UCED Hiring",
      description: "Design & Technology recruitment",
      color: "primary",
      icon: <Calendar className="w-10 h-10 text-primary" strokeWidth={1.5} />,
      requirements: [
        "Minimum GPA 3.0",
        "Commitment letter",
        "Portfolio of previous work",
        "Available for full internship period",
        "Strong communication skills"
      ]
    },
    {
      title: "SU IBM Hiring",
      description: "Tech career opportunities",
      color: "secondary",
      icon: <Users className="w-10 h-10 text-secondary" strokeWidth={1.5} />,
      requirements: [
        "Minimum GPA 3.2",
        "Commitment letter",
        "Technical assessment completion",
        "Resume and cover letter",
        "Available for interview sessions"
      ]
    }
  ];

  return (
    <div className="relative h-full bg-background overflow-y-auto">
      <div className="px-6 pt-16 pb-24">
        {/* Header with Avatar */}
        <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-4xl tracking-tight"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}
          >
            {greeting},
          </h1>
          <h1
            className="text-4xl tracking-tight"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}
          >
            Student
          </h1>
        </div>

        {/* Avatar Button */}
        <button
          onClick={() => setShowProfile(true)}
          className="relative flex-shrink-0 group"
          style={{ width: '64px', height: '64px' }}
        >
          <div className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(141, 212, 195, 0.15), rgba(255,184,148,0.08))' }}>
            <User className="w-8 h-8 text-primary/90" strokeWidth={1.5} />
          </div>
          <div
            className="absolute inset-0 rounded-full border-2 border-primary/30 group-hover:border-primary/50 transition-colors"
            style={{ pointerEvents: 'none' }}
          />
        </button>
      </div>

        {/* Floating Task Cards */}
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard
              key={event.title}
              icon={event.icon}
              title={event.title}
              description={event.description}
              color={event.color}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onApply={() => {
          setApplicationEvent(selectedEvent);
          setShowApplication(true);
          setSelectedEvent(null);
        }}
      />

      {/* Application Screen */}
      <AnimatePresence>
        {showApplication && applicationEvent && (
          <ApplicationScreen
            event={applicationEvent}
            onClose={() => {
              setShowApplication(false);
              setApplicationEvent(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Profile Screen */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onLogout={onLogout}
      />

      {/* Floating Camera Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCameraClick}
        className="absolute bottom-8 right-6 z-10"
        style={{
          width: '64px',
          height: '64px'
        }}
      >
        <div
          className="absolute inset-0 rounded-full backdrop-blur-xl"
          style={{
            background: 'rgba(141, 212, 195, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 12px 40px rgba(141, 212, 195, 0.3)'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-7 h-7 text-white" strokeWidth={2} />
        </div>
      </motion.button>
    </div>
  );
}

interface EventCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary';
  onClick?: () => void;
}

function EventCard({ icon, title, description, color, onClick }: EventCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: '24px'
      }}
    >
      {/* Glassmorphic Background */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: color === 'primary'
            ? 'linear-gradient(135deg, rgba(141, 212, 195, 0.15) 0%, rgba(141, 212, 195, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255, 184, 148, 0.15) 0%, rgba(255, 184, 148, 0.05) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      />

      {/* Content */}
      <div className="relative p-6 flex items-center gap-5">
        {/* Icon Container */}
        <div
          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: color === 'primary'
              ? 'rgba(141, 212, 195, 0.2)'
              : 'rgba(255, 184, 148, 0.2)'
          }}
        >
          {icon}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-xl mb-1"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600,
              color: '#1a1a1a'
            }}
          >
            {title}
          </h3>
          <p
            className="text-sm opacity-70"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              color: '#1a1a1a'
            }}
          >
            {description}
          </p>
        </div>

        {/* Arrow Indicator */}
        <ChevronRight className="w-5 h-5 opacity-40" strokeWidth={2} />
      </div>
    </motion.div>
  );
}

interface EventModalProps {
  event: EventDetails | null;
  onClose: () => void;
  onApply: () => void;
}

function EventModal({ event, onClose, onApply }: EventModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 z-50 overflow-y-auto"
        style={{
          background: event.color === 'primary'
            ? 'linear-gradient(135deg, rgba(141, 212, 195, 0.98) 0%, rgba(141, 212, 195, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 184, 148, 0.98) 0%, rgba(255, 184, 148, 0.95) 100%)',
        }}
      >
        {/* Content */}
        <div className="relative min-h-full px-6 pt-16 pb-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-transform hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <X className="w-6 h-6 text-white" strokeWidth={2} />
          </button>

          {/* Icon */}
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.25)'
            }}
          >
            {event.color === 'primary' ? (
              <Calendar className="w-12 h-12 text-white" strokeWidth={1.5} />
            ) : (
              <Users className="w-12 h-12 text-white" strokeWidth={1.5} />
            )}
          </div>

          {/* Title */}
          <h2
            className="text-4xl mb-3 text-white text-center"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            {event.title}
          </h2>

          {/* Description */}
          <p
            className="text-white/80 mb-10 text-center"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              fontSize: '16px'
            }}
          >
            {event.description}
          </p>

          {/* Requirements Label */}
          <h3
            className="text-sm uppercase tracking-wider text-white/70 mb-5 text-center"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.08em'
            }}
          >
            Requirements
          </h3>

          {/* Requirements List */}
          <div className="space-y-4 mb-10">
            {event.requirements.map((requirement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span
                  className="text-white flex-1"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.5'
                  }}
                >
                  {requirement}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Apply Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onApply}
            className="w-full py-5 rounded-2xl backdrop-blur-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span
              className="text-white"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '18px'
              }}
            >
              Apply Now
            </span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ApplicationScreenProps {
  event: EventDetails;
  onClose: () => void;
}

function ApplicationScreen({ event, onClose }: ApplicationScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gpa: '',
    phone: ''
  });

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="px-6 pt-16 pb-6 border-b border-border/50">
        <button
          onClick={onClose}
          className="flex items-center gap-2 mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
              fontSize: '16px'
            }}
          >
            Back
          </span>
        </button>

        <h1
          className="text-3xl mb-2"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}
        >
          Apply to {event.title}
        </h1>
        <p
          className="text-muted-foreground"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
          }}
        >
          Fill out the form below to submit your application
        </p>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6 overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
        <div className="space-y-6 max-w-md">
          {/* Full Name */}
          <div>
            <label
              className="block mb-2 text-sm"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                fontWeight: 500
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block mb-2 text-sm"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                fontWeight: 500
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@student.uc.ac.id"
              className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label
              className="block mb-2 text-sm"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                fontWeight: 500
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+62 812 3456 7890"
              className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
              }}
            />
          </div>

          {/* GPA */}
          <div>
            <label
              className="block mb-2 text-sm"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                fontWeight: 500
              }}
            >
              Current GPA
            </label>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="e.g., 3.5"
              className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
              }}
            />
          </div>

          {/* Upload Cards */}
          <div className="space-y-3 pt-2">
            <UploadCard
              icon={<FileText className="w-6 h-6" strokeWidth={1.5} />}
              title="Commitment Letter"
              color={event.color}
            />
            <UploadCard
              icon={<Upload className="w-6 h-6" strokeWidth={1.5} />}
              title="Portfolio / Resume"
              color={event.color}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl text-white"
          style={{
            background: event.color === 'primary' ? '#8dd4c3' : '#ffb894'
          }}
        >
          <span
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '17px'
            }}
          >
            Submit Application
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

interface UploadCardProps {
  icon: React.ReactNode;
  title: string;
  color: 'primary' | 'secondary';
}

function UploadCard({ icon, title, color }: UploadCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full p-4 rounded-2xl border border-dashed border-border/50 flex items-center gap-4 hover:border-primary/30 transition-colors"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: color === 'primary' ? 'rgba(141, 212, 195, 0.15)' : 'rgba(255, 184, 148, 0.15)',
          color: color === 'primary' ? '#8dd4c3' : '#ffb894'
        }}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p
          className="text-sm"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
            fontWeight: 500
          }}
        >
          {title}
        </p>
        <p
          className="text-xs text-muted-foreground"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
          }}
        >
          Tap to upload
        </p>
      </div>
      <Upload className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
    </motion.button>
  );
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

function ProfileModal({ isOpen, onClose, onLogout }: ProfileModalProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const profileData = {
    name: "Ahmad Pratama",
    studentNumber: "00000123456",
    major: "Information Systems",
    email: "ahmad.pratama@student.uc.ac.id"
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  const handleImageUpload = () => {
    // Simulate image upload - in real app would use file input
    const demoImages = [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
    ];
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    setProfileImage(randomImage);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 z-50 overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(141, 212, 195, 0.98) 0%, rgba(141, 212, 195, 0.95) 100%)',
        }}
      >
        {/* Content */}
        <div className="relative min-h-full px-6 pt-16 pb-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-transform hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <X className="w-6 h-6 text-white" strokeWidth={2} />
          </button>

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  width: '120px',
                  height: '120px',
                  border: '4px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  background: 'rgba(255,255,255,0.08)'
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Student profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white/90">
                    <User className="w-12 h-12" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Upload Photo Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleImageUpload}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(141, 212, 195, 0.5)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Camera className="w-5 h-5 text-primary" strokeWidth={2} />
              </motion.button>
            </div>
          </div>

          {/* Profile Title */}
          <h2
            className="text-4xl mb-10 text-white text-center"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Profile
          </h2>

          {/* Profile Info Cards */}
          <div className="space-y-4">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <User className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs text-white/70 mb-1"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Full Name
                  </p>
                  <p
                    className="text-lg text-white"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {profileData.name}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Student Number */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <Hash className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs text-white/70 mb-1"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Student Number
                  </p>
                  <p
                    className="text-lg text-white"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                      fontWeight: 600,
                      letterSpacing: '0.05em'
                    }}
                  >
                    {profileData.studentNumber}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Major */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs text-white/70 mb-1"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Major
                  </p>
                  <p
                    className="text-lg text-white"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {profileData.major}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl mt-8"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            <span
              className="text-white"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '17px'
              }}
            >
              Logout
            </span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface OrganizerMainScreenProps {
  onLogout: () => void;
}

function OrganizerMainScreen({ onLogout }: OrganizerMainScreenProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [uploadedEvents, setUploadedEvents] = useState([
    {
      id: 1,
      title: "Tech Career Fair 2026",
      date: "March 15, 2026",
      location: "Main Hall",
      attendees: 45
    },
    {
      id: 2,
      title: "Startup Networking Event",
      date: "April 10, 2026",
      location: "Innovation Center",
      attendees: 32
    }
  ]);

  return (
    <div className="relative h-full bg-background overflow-y-auto">
      <div className="px-6 pt-16 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl tracking-tight"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                fontWeight: 600,
                letterSpacing: '-0.02em'
              }}
            >
              Event Manager
            </h1>
            <p
              className="text-muted-foreground mt-1"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
              }}
            >
              Organizer Dashboard
            </p>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setShowProfile(true)}
            className="relative flex-shrink-0 group"
            style={{ width: '64px', height: '64px' }}
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ffb894 0%, #ff9a6c 100%)' }}
              >
                <Users className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>
            <div
              className="absolute inset-0 rounded-full border-2 border-secondary/30 group-hover:border-secondary/50 transition-colors"
              style={{ pointerEvents: 'none' }}
            />
          </button>
        </div>

        {/* Upload Event Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUploadForm(true)}
          className="w-full p-6 rounded-3xl mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 184, 148, 0.15) 0%, rgba(255, 184, 148, 0.05) 100%)',
            border: '2px dashed rgba(255, 184, 148, 0.4)'
          }}
        >
          <Plus className="w-12 h-12 mx-auto mb-3 text-secondary" strokeWidth={1.5} />
          <h3
            className="text-xl"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600
            }}
          >
            Upload New Event
          </h3>
          <p
            className="text-sm text-muted-foreground mt-1"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
            }}
          >
            Create and publish a new event
          </p>
        </motion.button>

        {/* Events You Uploaded */}
        <div>
          <h2
            className="text-xl mb-4"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 600
            }}
          >
            Events You Uploaded
          </h2>

          <div className="space-y-3">
            {uploadedEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.01, y: -2 }}
                className="relative overflow-hidden"
                style={{ borderRadius: '24px' }}
              >
                <div
                  className="absolute inset-0 backdrop-blur-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 184, 148, 0.15) 0%, rgba(255, 184, 148, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />

                <div className="relative p-5">
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                      <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}>
                        {event.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" strokeWidth={2} />
                      <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}>
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" strokeWidth={2} />
                      <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}>
                        {event.attendees} attendees
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Event Form Modal */}
      <UploadEventModal
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
      />

      {/* Profile Modal for Organizer */}
      <OrganizerProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onLogout={onLogout}
      />
    </div>
  );
}

interface UploadEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UploadEventModal({ isOpen, onClose }: UploadEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 z-50 overflow-y-auto bg-background"
      >
        <div className="px-6 pt-16 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-3xl"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                fontWeight: 700
              }}
            >
              Upload Event
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0, 0, 0, 0.05)' }}
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', fontWeight: 500 }}>
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-secondary/30"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', fontWeight: 500 }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-secondary/30"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', fontWeight: 500 }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
                className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-secondary/30"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', fontWeight: 500 }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-border/50 bg-card focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Handle upload
              onClose();
            }}
            className="w-full py-4 rounded-2xl mt-8 text-white"
            style={{ background: '#ffb894' }}
          >
            <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif', fontWeight: 600, fontSize: '17px' }}>
              Publish Event
            </span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface CommitteeMember {
  name: string;
  studentNumber: string;
  role: string;
  photo: string;
  attendance: {
    date: string;
    type: 'online' | 'offline';
    joinTime: string;
    status: 'present' | 'absent';
  }[];
}

interface Event {
  id: number;
  title: string;
  committee: CommitteeMember[];
}

function AttendanceListScreen() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const events: Event[] = [
    {
      id: 1,
      title: "Tech Career Fair 2026",
      committee: [
        {
          name: "Ahmad Pratama",
          studentNumber: "00000123456",
          role: "Coordinator",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
          attendance: [
            { date: "2026-03-01", type: "offline", joinTime: "09:00 AM", status: "present" },
            { date: "2026-03-05", type: "online", joinTime: "10:15 AM", status: "present" },
            { date: "2026-03-10", type: "offline", joinTime: "-", status: "absent" }
          ]
        },
        {
          name: "Siti Nurhaliza",
          studentNumber: "00000123457",
          role: "Logistics",
          photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
          attendance: [
            { date: "2026-03-01", type: "offline", joinTime: "09:05 AM", status: "present" },
            { date: "2026-03-05", type: "online", joinTime: "-", status: "absent" },
            { date: "2026-03-10", type: "offline", joinTime: "-", status: "absent" },
            { date: "2026-03-15", type: "offline", joinTime: "-", status: "absent" }
          ]
        },
        {
          name: "Budi Santoso",
          studentNumber: "00000123458",
          role: "Documentation",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
          attendance: [
            { date: "2026-03-01", type: "offline", joinTime: "08:55 AM", status: "present" },
            { date: "2026-03-05", type: "online", joinTime: "10:20 AM", status: "present" },
            { date: "2026-03-10", type: "offline", joinTime: "09:10 AM", status: "present" }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Startup Networking Event",
      committee: [
        {
          name: "Dewi Lestari",
          studentNumber: "00000123459",
          role: "Coordinator",
          photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
          attendance: [
            { date: "2026-04-01", type: "offline", joinTime: "09:00 AM", status: "present" },
            { date: "2026-04-05", type: "online", joinTime: "10:00 AM", status: "present" }
          ]
        },
        {
          name: "Andi Wijaya",
          studentNumber: "00000123460",
          role: "Marketing",
          photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
          attendance: [
            { date: "2026-04-01", type: "offline", joinTime: "09:10 AM", status: "present" },
            { date: "2026-04-05", type: "online", joinTime: "-", status: "absent" }
          ]
        }
      ]
    }
  ];

  const calculateAbsences = (attendance: CommitteeMember['attendance']) => {
    return attendance.filter(a => a.status === 'absent').length;
  };

  const getEvaluationStatus = (absences: number) => {
    if (absences > 2) {
      return { status: 'poor', color: '#ef4444', label: 'Poor Evaluation' };
    } else if (absences === 2) {
      return { status: 'warning', color: '#f59e0b', label: 'At Risk' };
    } else {
      return { status: 'good', color: '#10b981', label: 'Good Standing' };
    }
  };

  if (selectedEvent !== null) {
    const event = events.find(e => e.id === selectedEvent);
    if (!event) return null;

    return (
      <div className="relative h-full bg-background overflow-y-auto">
        <div className="px-6 pt-16 pb-24">
          <button
            onClick={() => setSelectedEvent(null)}
            className="flex items-center gap-2 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', fontSize: '16px' }}>
              Back
            </span>
          </button>

          <h1
            className="text-3xl mb-2"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 700
            }}
          >
            {event.title}
          </h1>
          <p
            className="text-muted-foreground mb-6"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}
          >
            Committee Members
          </p>

          {/* QR Code Generator Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQRCode(true)}
            className="w-full p-5 rounded-3xl mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 184, 148, 0.15) 0%, rgba(255, 184, 148, 0.05) 100%)',
              border: '2px solid rgba(255, 184, 148, 0.4)'
            }}
          >
            <QrCode className="w-10 h-10 mx-auto mb-2 text-secondary" strokeWidth={1.5} />
            <h3
              className="text-lg"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                fontWeight: 600
              }}
            >
              Generate Attendance QR Code
            </h3>
          </motion.button>

          {/* Committee List with Attendance */}
          <div className="space-y-4">
            {event.committee.map((member, index) => {
              const absences = calculateAbsences(member.attendance);
              const evaluation = getEvaluationStatus(absences);

              return (
                <div
                  key={index}
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: 'rgba(255, 184, 148, 0.1)',
                    border: '1px solid rgba(255, 184, 148, 0.2)'
                  }}
                >
                  {/* Member Header */}
                  <div className="p-5 flex items-center gap-4">
                    <div
                      className="rounded-full overflow-hidden flex-shrink-0"
                      style={{
                        width: '64px',
                        height: '64px',
                        border: '2px solid rgba(255, 184, 148, 0.3)'
                      }}
                    >
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg mb-1"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                          fontWeight: 600
                        }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}>
                        {member.studentNumber}
                      </p>
                      <p className="text-sm text-secondary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', fontWeight: 500 }}>
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Evaluation Badge */}
                  <div
                    className="px-5 py-3 flex items-center gap-2"
                    style={{
                      background: absences > 2 ? 'rgba(239, 68, 68, 0.1)' : absences === 2 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {absences > 2 ? (
                      <TrendingDown className="w-4 h-4" style={{ color: evaluation.color }} strokeWidth={2} />
                    ) : absences === 2 ? (
                      <AlertCircle className="w-4 h-4" style={{ color: evaluation.color }} strokeWidth={2} />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" style={{ color: evaluation.color }} strokeWidth={2} />
                    )}
                    <span
                      className="text-sm flex-1"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                        fontWeight: 500,
                        color: evaluation.color
                      }}
                    >
                      {evaluation.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                        color: evaluation.color
                      }}
                    >
                      {absences} absences
                    </span>
                  </div>

                  {/* Attendance Records */}
                  <div className="px-5 pb-5 pt-3">
                    <h4
                      className="text-xs uppercase tracking-wider text-muted-foreground mb-3"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                        fontWeight: 600
                      }}
                    >
                      Attendance History
                    </h4>
                    <div className="space-y-2">
                      {member.attendance.map((record, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl"
                          style={{
                            background: record.status === 'present' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                            border: `1px solid ${record.status === 'present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                          }}
                        >
                          <div className="flex-1">
                            <p
                              className="text-sm mb-1"
                              style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                                fontWeight: 500
                              }}
                            >
                              {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  background: record.type === 'online' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                                  color: record.type === 'online' ? '#3b82f6' : '#a855f7',
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif',
                                  fontWeight: 500
                                }}
                              >
                                {record.type}
                              </span>
                              {record.status === 'present' && (
                                <span className="text-xs text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}>
                                  {record.joinTime}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            {record.status === 'present' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2} />
                            ) : (
                              <X className="w-5 h-5 text-red-500" strokeWidth={2} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QR Code Modal */}
        <QRCodeModal
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          eventTitle={event.title}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full bg-background overflow-y-auto">
      <div className="px-6 pt-16 pb-24">
        <h1
          className="text-4xl mb-2"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
            fontWeight: 600
          }}
        >
          Attendance List
        </h1>
        <p
          className="text-muted-foreground mb-8"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif' }}
        >
          Select an event to view committee
        </p>

        <div className="space-y-4">
          {events.map((event) => (
            <motion.button
              key={event.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEvent(event.id)}
              className="w-full text-left relative overflow-hidden"
              style={{ borderRadius: '24px' }}
            >
              <div
                className="absolute inset-0 backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 184, 148, 0.15) 0%, rgba(255, 184, 148, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />

              <div className="relative p-6 flex items-center gap-5">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(255, 184, 148, 0.2)' }}
                >
                  <Users className="w-10 h-10 text-secondary" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl mb-1"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-sm opacity-70"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
                    }}
                  >
                    {event.committee.length} committee members
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 opacity-40" strokeWidth={2} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
}

function QRCodeModal({ isOpen, onClose, eventTitle }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm p-8 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 184, 148, 0.98) 0%, rgba(255, 184, 148, 0.95) 100%)'
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <X className="w-5 h-5 text-white" strokeWidth={2} />
          </button>

          <h3
            className="text-2xl text-white text-center mb-6"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 700
            }}
          >
            Attendance QR Code
          </h3>

          {/* QR Code Placeholder */}
          <div
            className="bg-white rounded-2xl p-6 mb-6 mx-auto"
            style={{ width: '240px', height: '240px' }}
          >
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'repeating-linear-gradient(90deg, #000 0px, #000 10px, #fff 10px, #fff 20px)' }}>
              <QrCode className="w-20 h-20 text-secondary" strokeWidth={1.5} />
            </div>
          </div>

          <p
            className="text-white text-center text-sm"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
            }}
          >
            {eventTitle}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface OrganizerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function OrganizerProfileModal({ isOpen, onClose, onLogout }: OrganizerProfileModalProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const profileData = {
    name: "Event Management Team",
    organization: "UC Student Organization",
    email: "events@uc.ac.id"
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const handleImageUpload = () => {
    // Simulate image upload
    const demoImages = [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
    ];
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    setProfileImage(randomImage);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 z-50 overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 184, 148, 0.98) 0%, rgba(255, 184, 148, 0.95) 100%)',
        }}
      >
        <div className="relative min-h-full px-6 pt-16 pb-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-transform hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <X className="w-6 h-6 text-white" strokeWidth={2} />
          </button>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  width: '120px',
                  height: '120px',
                  background: profileImage ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                  border: '4px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Organizer profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-16 h-16 text-white" strokeWidth={1.5} />
                )}
              </div>

              {/* Upload Photo Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleImageUpload}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(255, 184, 148, 0.5)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Camera className="w-5 h-5 text-secondary" strokeWidth={2} />
              </motion.button>
            </div>
          </div>

          <h2
            className="text-4xl mb-10 text-white text-center"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Profile
          </h2>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <User className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/70 mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Organization
                  </p>
                  <p className="text-lg text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif', fontWeight: 600 }}>
                    {profileData.name}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <Mail className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/70 mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Email
                  </p>
                  <p className="text-lg text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif', fontWeight: 600 }}>
                    {profileData.email}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl mt-8"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            <span
              className="text-white"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '17px'
              }}
            >
              Logout
            </span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CameraScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative h-full bg-gradient-to-br from-zinc-900 to-zinc-800">
      {/* Camera UI Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white/60">
          <div className="w-48 h-48 mx-auto mb-6 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center">
            <Calendar className="w-20 h-20 opacity-30" strokeWidth={1} />
          </div>
          <p
            className="text-lg"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
            }}
          >
            Scan Event QR Code
          </p>
          <p
            className="text-sm mt-2 opacity-50"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
            }}
          >
            Point camera at QR code to check in
          </p>
        </div>
      </div>

      {/* Camera Capture Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="absolute bottom-8 right-6 z-10"
        style={{
          width: '64px',
          height: '64px'
        }}
      >
        <div
          className="absolute inset-0 rounded-full backdrop-blur-xl"
          style={{
            background: 'rgba(141, 212, 195, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 12px 40px rgba(141, 212, 195, 0.3)'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white" />
        </div>
      </motion.button>

      {/* Swipe Hint */}
      <div className="absolute bottom-24 right-6 flex items-center gap-2 text-white/40 text-xs">
        <motion.div
          animate={{ x: [-4, 0, -4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" strokeWidth={2} />
        </motion.div>
        <span
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", system-ui, sans-serif'
          }}
        >
          Swipe to go back
        </span>
      </div>
    </div>
  );
}
