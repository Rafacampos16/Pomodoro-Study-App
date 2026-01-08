console.log("App renderizou");


import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import MainTimer from "./components/MainTimer";
import MusicPlayer from "./components/MusicPlayer";
import TaskList from "./components/TaskList";
import "./styles/global.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [focusRunning, setFocusRunning] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");


    const [tasks, setTasks] = useState(() => {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const isDarkColor = (hex) => {
      if (!hex) return false;

      const c = hex.replace("#", "");
      const r = parseInt(c.substr(0, 2), 16);
      const g = parseInt(c.substr(2, 2), 16);
      const b = parseInt(c.substr(4, 2), 16);

      const luminance = 0.299*r + 0.587*g + 0.114*b;
      return luminance < 150;
    };


  function changeMode(newMode, newTime) {
  playClick();
  setAnimate(true);

  setTimeout(() => {
    setMode(newMode);
    setTime(newTime);
    setRunning(false);
    setAnimate(false);
  }, 200);
}

const togglePomodoro = () => {
  setShowPomodoro(v => {
    if (v === true) {
      setPomodoroRunning(false); // 🔴 para o estado visual
    }
    return !v;
  });
};





  return (
    
    <>
      {/* ☰ MENU */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
      >
        <span />
        <span />
        <span />
      </button>


     {menuOpen && (
   <Menu
      showMusic={showMusic}
      toggleMusic={() => setShowMusic(v => !v)}

      showTasks={showTasks}
      toggleTasks={() => setShowTasks(v => !v)}

      showPomodoro={showPomodoro}
      togglePomodoro={() => setShowPomodoro(v => !v)}

      showFocusTimer={showFocusTimer}                 // ✅
      toggleFocusTimer={() => setShowFocusTimer(v => !v)} // ✅
      pomodoroRunning={pomodoroRunning} 
      focusRunning={focusRunning} 
      pendingTasks={pendingTasks}
    />


    )}


      {/* ⏰ CLOCK + 🍅 POMODORO */}
    <MainTimer
      showPomodoro={showPomodoro}
      showFocusTimer={showFocusTimer}
      onPomodoroRunningChange={setPomodoroRunning}
      onFocusRunningChange={setFocusRunning}
    />

<div className={`app ${isDarkColor(bgColor) ? "on-dark" : ""}`}>

</div>
   {showTasks && (
    <TaskList
    tasks={tasks}
    setTasks={setTasks}
    onTasksChange={setPendingTasks}
  />

  )}

      {/* 🎵 PLAYER */}
      {showMusic && <MusicPlayer />}

    </>
  );
}
