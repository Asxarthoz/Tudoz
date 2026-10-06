import { useState, useCallback } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoProvider, useTodo } from './context/TodoContext';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { LockScreen } from './components/LockScreen';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/TasksPage';
import { EventsPage } from './pages/EventsPage';
import { GoalsPage } from './pages/GoalsPage';
import { DailyRoutinePage } from './pages/DailyRoutinePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotesPage } from './pages/NotesPage';
import { SportsPage } from './pages/SportsPage';
import './App.css';

// Alur saat aplikasi dibuka: Splash → (LockScreen jika kunci aktif) → isi aplikasi
function AppShell() {
  const { settings } = useTodo();
  const [showSplash, setShowSplash] = useState(true);
  // Dicek sekali saat start: mengaktifkan kunci di tengah sesi tidak langsung mengunci aplikasi
  const [unlocked, setUnlocked] = useState(() => !settings.appLock);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {unlocked ? (
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="routine" element={<DailyRoutinePage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="sports" element={<SportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      ) : (
        <LockScreen onUnlock={() => setUnlocked(true)} />
      )}
      {showSplash && <SplashScreen onDone={hideSplash} />}
    </>
  );
}

function App() {
  return (
    <TodoProvider>
      <AppShell />
    </TodoProvider>
  );
}

export default App;
