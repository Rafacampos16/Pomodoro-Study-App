import { useEffect, useState } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

export default function FocusTimer({ onRunningChange }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    onRunningChange?.(running);
  }, [running, onRunningChange]);

  const format = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    
    <div className={`focus-timer ${running ? "active" : ""}`}>
      <div className="focus-left">
        <Timer size={16} />
        <span className="focus-time">{format(seconds)}</span>
      </div>

      <div className="focus-controls">
        <button onClick={() => setRunning((v) => !v)}>
          {running ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={() => {
            setSeconds(0);
            setRunning(false);
          }}
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
