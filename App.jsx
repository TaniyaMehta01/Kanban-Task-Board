import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Pencil, Check, X, ChevronLeft, ChevronRight, CalendarDays, LayoutGrid, ListTodo, CircleHelp } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', subtitle: 'Things to get started', color: '#64748b' },
  { id: 'progress', title: 'In Progress', subtitle: 'Work currently underway', color: '#6d5dfc' },
  { id: 'done', title: 'Done', subtitle: 'Successfully completed', color: '#16a37a' }
];
const starter = [
  { id: 1, title: 'Plan project structure', description: 'Create folders and decide the component layout.', status: 'todo', priority: 'High', due: '' },
  { id: 2, title: 'Design dashboard UI', description: 'Build a clean and responsive task board.', status: 'progress', priority: 'Medium', due: '' },
  { id: 3, title: 'Set up React with Vite', description: 'Initialize the project and install dependencies.', status: 'done', priority: 'Low', due: '' }
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flowboard-tasks')) || starter; }
    catch { return starter; }
  });
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', due: '', status: 'todo' });
  const [dragged, setDragged] = useState(null);

  useEffect(() => localStorage.setItem('flowboard-tasks', JSON.stringify(tasks)), [tasks]);

  const filtered = useMemo(() => tasks.filter(t =>
    `${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase())
  ), [tasks, query]);

  const openAdd = (status = 'todo') => {
    setEditing(null);
    setForm({ title: '', description: '', priority: 'Medium', due: '', status });
    setModal(true);
  };
  const openEdit = task => {
    setEditing(task.id);
    setForm({ title: task.title, description: task.description || '', priority: task.priority, due: task.due || '', status: task.status });
    setModal(true);
  };
  const saveTask = e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) setTasks(old => old.map(t => t.id === editing ? { ...t, ...form, title: form.title.trim() } : t));
    else setTasks(old => [{ ...form, title: form.title.trim(), id: Date.now() }, ...old]);
    setModal(false);
  };
  const move = (id, direction) => setTasks(old => old.map(t => {
    if (t.id !== id) return t;
    const index = COLUMNS.findIndex(c => c.id === t.status);
    return { ...t, status: COLUMNS[Math.max(0, Math.min(2, index + direction))].id };
  }));
  const dropOn = status => {
    if (dragged !== null) setTasks(old => old.map(t => t.id === dragged ? { ...t, status } : t));
    setDragged(null);
  };
  const totalDone = tasks.filter(t => t.status === 'done').length;
  const progress = tasks.length ? Math.round(totalDone / tasks.length * 100) : 0;

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-icon"><LayoutGrid size={21}/></div><span>flow<span className="brand-light">board</span></span></div>
      <div className="top-actions"><span className="saved"><span className="live-dot"/> Saved automatically</span><div className="avatar">FB</div></div>
    </header>

    <section className="hero">
      <div>
        <div className="eyebrow"><span/> WORKSPACE / MY BOARD</div>
        <h1>Project workspace</h1>
        <p className="hero-sub">A clear view of what needs doing, what's moving, and what's done.</p>
      </div>
      <button className="primary-btn" onClick={() => openAdd()}><Plus size={18}/> Add task</button>
    </section>

    <section className="overview">
      <div className="overview-left">
        <div className="overview-icon"><ListTodo size={20}/></div>
        <div><strong>{tasks.length} tasks</strong><span> across your workspace</span></div>
      </div>
      <div className="progress-wrap"><div className="progress-label"><span>Overall progress</span><strong>{progress}%</strong></div><div className="progress-track"><div style={{width: `${progress}%`}}/></div></div>
      <div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks..." aria-label="Search tasks"/></div>
    </section>

    <section className="board">
      {COLUMNS.map((col, index) => {
        const items = filtered.filter(t => t.status === col.id);
        return <section className="column" key={col.id} onDragOver={e => e.preventDefault()} onDrop={() => dropOn(col.id)}>
          <div className="column-head">
            <div className="column-title"><span className="column-dot" style={{background: col.color}}/><h2>{col.title}</h2><span className="count">{items.length}</span></div>
            <button className="icon-btn add-small" onClick={() => openAdd(col.id)} aria-label={`Add task to ${col.title}`}><Plus size={18}/></button>
          </div>
          <p className="column-sub">{col.subtitle}</p>
          <div className="task-list">
            {items.map(task => <article className="task-card" key={task.id} draggable onDragStart={() => setDragged(task.id)} onDragEnd={() => setDragged(null)}>
              <div className="card-top"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span><div className="card-actions">
                <button className="icon-btn" onClick={() => openEdit(task)} aria-label="Edit task"><Pencil size={15}/></button>
                <button className="icon-btn delete-btn" onClick={() => setTasks(old => old.filter(t => t.id !== task.id))} aria-label="Delete task"><Trash2 size={15}/></button>
              </div></div>
              <h3>{task.title}</h3>
              {task.description && <p className="task-description">{task.description}</p>}
              {task.due && <div className="due"><CalendarDays size={13}/>{new Date(task.due + 'T00:00:00').toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>}
              <div className="card-footer">
                <span className="task-id">TASK-{String(task.id).slice(-4)}</span>
                <div className="move-actions">
                  {index > 0 && <button onClick={() => move(task.id, -1)} title="Move to previous column"><ChevronLeft size={16}/></button>}
                  {index < 2 && <button onClick={() => move(task.id, 1)} title="Move to next column"><ChevronRight size={16}/></button>}
                </div>
              </div>
            </article>)}
            {items.length === 0 && <div className="empty"><div className="empty-icon"><ListTodo size={20}/></div><strong>{query ? 'No matching tasks' : 'No tasks yet'}</strong><span>{query ? 'Try another search.' : 'Add a task to get started.'}</span>{!query && <button onClick={() => openAdd(col.id)}>＋ Add a task</button>}</div>}
          </div>
        </section>;
      })}
    </section>
    <footer><span>FLOWBOARD <span className="footer-dot">·</span> YOUR WORK, IN FLOW</span><span><CircleHelp size={14}/> Drag cards between columns to update their status.</span></footer>

    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}>
      <form className="modal" onSubmit={saveTask}>
        <div className="modal-head"><div><span className="eyebrow">TASK DETAILS</span><h2>{editing ? 'Edit task' : 'Create a task'}</h2></div><button type="button" className="icon-btn" onClick={() => setModal(false)}><X size={20}/></button></div>
        <label>Task name <span>*</span><input autoFocus required maxLength="90" value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Prepare project presentation"/></label>
        <label>Description <textarea rows="3" value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Add a few details about this task..."/></label>
        <div className="form-row">
          <label>Priority<select value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>{COLUMNS.map(c => <option value={c.id} key={c.id}>{c.title}</option>)}</select></label>
        </div>
        <label>Due date <input type="date" value={form.due} onChange={e => setForm({...form, due:e.target.value})}/></label>
        <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancel</button><button className="primary-btn" type="submit"><Check size={17}/>{editing ? 'Save changes' : 'Create task'}</button></div>
      </form>
    </div>}
  </main>;
}
export default App;