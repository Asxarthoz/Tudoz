import { createContext, useContext, useState, useEffect } from 'react';

const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);

const getTodayStr = () => new Date().toISOString().split('T')[0];

const defaultSettings = {
  theme: 'dark',
  accentColor: '#8b5cf6',
  username: '',
  soundEnabled: true,
  autoResetRoutines: true
};

export const TodoProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('todo_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('todo_events');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    const today = getTodayStr();
    return parsed.filter(e => !e.date || e.date >= today);
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('todo_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('todo_routines');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // Auto-reset: tandai done=false jika lastReset bukan hari ini
    const today = getTodayStr();
    return parsed.map(r => r.lastReset !== today ? { ...r, done: false, lastReset: today } : r);
  });

  useEffect(() => { localStorage.setItem('todo_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('todo_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('todo_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('todo_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('todo_settings', JSON.stringify(settings)); }, [settings]);

  // Theme & Accent Color injection
  useEffect(() => {
    if (settings.theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    
    // adjust hover color slightly based on accent
    // (a simple approach is to use opacity or hardcode variations if possible, 
    // but here we just leave the hover as a generic opacity if needed, 
    // or let's not change hover here, just set primary accent)
  }, [settings.theme, settings.accentColor]);

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetAllData = () => {
    setTasks([]);
    setEvents([]);
    setGoals([]);
    setRoutines([]);
    // Settings can be kept or reset, let's just keep settings
  };

  const importData = (data) => {
    if (data.tasks) setTasks(data.tasks);
    if (data.events) setEvents(data.events);
    if (data.goals) setGoals(data.goals);
    if (data.routines) setRoutines(data.routines);
    if (data.settings) setSettings({ ...defaultSettings, ...data.settings });
  };

  const playDoneSound = () => {
    if (!settings.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported', e);
    }
  };


  // Tasks
  const addTask = (task) => setTasks(prev => [...prev, { ...task, id: Date.now().toString(), completed: false }]);
  const updateTask = (id, updated) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  const removeTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  // Events
  const addEvent = (event) => setEvents(prev => [...prev, { ...event, id: Date.now().toString(), completed: false }]);
  const updateEvent = (id, updated) => setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  const removeEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));
  const toggleEvent = (id) => setEvents(prev => prev.map(e => e.id === id ? { ...e, completed: !e.completed } : e));

  // Goals
  const addGoal = (goal) => setGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
  const updateGoal = (id, updated) => setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
  const removeGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  // Daily Routines
  const addRoutine = (routine) => setRoutines(prev => [...prev, {
    ...routine,
    id: Date.now().toString(),
    done: false,
    lastReset: getTodayStr()
  }]);
  const updateRoutine = (id, updated) => setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  const removeRoutine = (id) => setRoutines(prev => prev.filter(r => r.id !== id));
  const toggleRoutine = (id) => setRoutines(prev => prev.map(r =>
    r.id === id ? { ...r, done: !r.done, lastReset: getTodayStr() } : r
  ));

  return (
    <TodoContext.Provider value={{
      tasks, addTask, updateTask, removeTask, toggleTask,
      events, addEvent, updateEvent, removeEvent, toggleEvent,
      goals, addGoal, updateGoal, removeGoal,
      routines, addRoutine, updateRoutine, removeRoutine, toggleRoutine,
      settings, updateSettings, resetAllData, importData, playDoneSound
    }}>
      {children}
    </TodoContext.Provider>
  );
};
