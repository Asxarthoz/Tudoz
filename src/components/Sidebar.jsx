import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, CalendarDays, Target, Repeat, Settings, FileText, Dumbbell } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div style={{ padding: '0 24px', marginBottom: '30px' }}>
        <h2 style={{ background: 'linear-gradient(to right, #a5b4fc, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>
          Tudoz
        </h2>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/goals" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Target size={20} />
          <span>Goals</span>
        </NavLink>
        <NavLink to="/routine" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Repeat size={20} />
          <span>Rutinitas Harian</span>
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <CheckSquare size={20} />
          <span>Tugas</span>
        </NavLink>
        <NavLink to="/events" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <CalendarDays size={20} />
          <span>Event</span>
        </NavLink>
        <NavLink to="/notes" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FileText size={20} />
          <span>Catatan</span>
        </NavLink>
        <NavLink to="/sports" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Dumbbell size={20} />
          <span>Olahraga</span>
        </NavLink>
      </nav>
      <div style={{ marginTop: 'auto', padding: '0' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Settings size={20} />
            <span>Pengaturan</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
