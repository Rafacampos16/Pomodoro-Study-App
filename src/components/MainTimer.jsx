import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import MusicPlayer from "./MusicPlayer";
import PomodoroWidget from "./PomodoroWidget";
import FocusTimer from "./FocusTimer";

export default function MainTimer({
  showPomodoro,
  showFocusTimer,          // ✅ ADICIONA ISSO
  onPomodoroRunningChange,
  forceStop,
  onFocusRunningChange,
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  return (
    <>
      {/* 🎨 + ⏱️ widgets pequenos */}
     <div className="side-widgets">
      <ColorPicker />

      {showFocusTimer && (
        <FocusTimer onRunningChange={onFocusRunningChange} />
      )}

      </div>

      {/* 🕒 RELÓGIO CENTRAL */}
      <main className="main">
        <h1 className="clock">
          {now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h1>

        {/* 🍅 Pomodoro */}
        {showPomodoro && (
          <div className="pomodoro-wrapper">
            <PomodoroWidget
              onRunningChange={onPomodoroRunningChange}
              forceStop={forceStop}
            />
          </div>
        )}
      </main>
    </>
  );
}
