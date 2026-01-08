import { Timer, Music, ListTodo, Clock } from "lucide-react";



export default function Menu({
  showMusic,
  toggleMusic,
  showTasks,
  toggleTasks,
  showPomodoro,
  togglePomodoro,
  showFocusTimer,      // ✅
  toggleFocusTimer,
  pomodoroRunning, 
  focusRunning, 
  tasksCount,
  props,
  pendingTasks,
}) {

  console.log("📍 Menu props:", props);
  

  return (
    <aside className="side-menu">
     <button
      className={`
        menu-item
        ${showPomodoro ? "active" : ""}
        ${pomodoroRunning ? "running" : ""}
        ${focusRunning ? "running" : ""}
      `}
      onClick={togglePomodoro}
    >
      <Timer size={22} />
      <span>Pomodoro</span>
    </button>



      <button
        className={`menu-item ${showMusic ? "active" : ""}`}
        onClick={toggleMusic}
      >
        <Music size={22} />
        <span>Música</span>

      </button>
      
      <button
        className={`menu-item ${showTasks ? "active" : ""}`}
        onClick={toggleTasks}
      >
        <ListTodo size={22} />

        {pendingTasks > 0 && (
          <span className="task-badge">
            {pendingTasks}
          </span>
        )}

        <span>Tarefas</span>
      </button>





   <button
      className={`menu-item ${showFocusTimer ? "active" : ""}`}
      onClick={toggleFocusTimer}
    >
      <Clock size={22} />
      <span>Focus</span>
    </button>


    </aside>
  );
}
