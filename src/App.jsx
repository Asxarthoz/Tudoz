import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/TasksPage';
import { EventsPage } from './pages/EventsPage';
import { GoalsPage } from './pages/GoalsPage';
import { DailyRoutinePage } from './pages/DailyRoutinePage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="routine" element={<DailyRoutinePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </TodoProvider>
  );
}

export default App;
