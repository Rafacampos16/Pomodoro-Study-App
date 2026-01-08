import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward } from "lucide-react";
import bell from "../assets/music/bell.wav";
import click from "../assets/music/click.wav";

const MODES = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const NEXT_MODE = {
  pomodoro: "short",
  short: "long",
  long: "pomodoro",
};

const formatTabTime = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
};



export default function PomodoroWidget({ onRunningChange, forceStop }) {


  const [mode, setMode] = useState("pomodoro");
  const [seconds, setSeconds] = useState(MODES.pomodoro);
  const [running, setRunning] = useState(false);
  const [activity, setActivity] = useState("");


  const bellSound = useRef(new Audio(bell));
  const clickSound = useRef(new Audio(click));
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const unlockAudio = () => {
  if (audioUnlocked) return;

  [bellSound, clickSound].forEach(ref => {
    ref.current.volume = 0;
    ref.current.play()
      .then(() => {
        ref.current.pause();
        ref.current.currentTime = 0;
        ref.current.volume = 1;
      })
      .catch(() => {});
  });

  setAudioUnlocked(true);
};


  /* 🔊 FUNÇÃO PADRÃO PARA TOCAR SOM (resolve seu bug) */
  const playSound = (audioRef) => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  

  const [animating, setAnimating] = useState(false);

    useEffect(() => {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(t);
    }, [mode]);

    useEffect(() => {
      const saved = localStorage.getItem("pomodoro-activity");
      if (saved) setActivity(saved);
    }, []);

    useEffect(() => {
      localStorage.setItem("pomodoro-activity", activity);
    }, [activity]);

    useEffect(() => {
    if (onRunningChange) {
      onRunningChange(running);
    }
  }, [running, onRunningChange]);

  useEffect(() => {
  if (forceStop) {
    setRunning(false);
  }
}, [forceStop]);




  /* ⏱ TIMER */
     useEffect(() => {
      if (!running) return;

      const interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            playSound(bellSound);
            setRunning(false);

            // ⏭ troca de modo no próximo frame
            setTimeout(() => {
              goNext();
            }, 0);

            return 0; // ✅ NUNCA retorna 1
          }

          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [running, mode]);


    
      useEffect(() => {
        if (running) {
          const task = activity?.trim();
          document.title = task
            ? `${formatTabTime(seconds)} • ${task}`
            : `${formatTabTime(seconds)} • Pomodoro`;
        } else {
          document.title = "Pomodoro Study";
        }

        return () => {
          document.title = "Pomodoro Study";
        };
      }, [running, seconds, activity]);


  /* 🔁 TROCA DE MODO */
  const changeMode = (newMode) => {
  playSound(clickSound);
  setMode(newMode);
  setSeconds(MODES[newMode]);
  setRunning(false);
};


  /* ▶️ PLAY / PAUSE */
  const toggle = () => {
  unlockAudio();        // 🔓 libera o áudio
  playSound(clickSound);
  setRunning(v => !v);
};


  /* ⏭ SKIP */
    const skip = () => {
  unlockAudio();
  playSound(clickSound);
  goNext();
};
;



const goNext = () => {
  const next = NEXT_MODE[mode];
  setMode(next);
  setSeconds(MODES[next]);
  setRunning(false);
};



const handleAutoSwitch = (isAuto = false) => {
  if (mode === "pomodoro") {
    if (isAuto) {
      const nextCycle = cycle + 1;
      setCycle(nextCycle);

      if (nextCycle % 4 === 0) {
        setMode("long");
        setSeconds(MODES.long);
      } else {
        setMode("short");
        setSeconds(MODES.short);
      }
    } else {
      // skip manual do pomodoro → vai para pausa curta
      setMode("short");
      setSeconds(MODES.short);
    }
  } else {
    // qualquer pausa sempre volta para pomodoro
    setMode("pomodoro");
    setSeconds(MODES.pomodoro);
  }
};



  const format = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
   <div className={`pomodoro-card ${mode} ${animating ? "animating" : ""}`}>
      {/* MODOS */}
      <div className="modes radio-inputs">
          <label className="radio">
            <input
              type="radio"
              name="mode"
              checked={mode === "pomodoro"}
              onChange={() => changeMode("pomodoro")}
            />
            <span className="name">Pomodoro</span>
          </label>

          <label className="radio">
            <input
              type="radio"
              name="mode"
              checked={mode === "short"}
              onChange={() => changeMode("short")}
            />
            <span className="name">Pausa</span>
          </label>

          <label className="radio">
            <input
              type="radio"
              name="mode"
              checked={mode === "long"}
              onChange={() => changeMode("long")}
            />
            <span className="name">Longa</span>
          </label>
        </div>


      {/* TIMER */}
    <div className="pomodoro-time">
      {format(seconds)}
    </div>

      {/* CONTROLES */}
      <div className="pomodoro-controls">
        <button className="main-btn" onClick={toggle}>
          {running ? <Pause /> : <Play />}
        </button>

        <button className="skip-btn" onClick={skip}>
          <SkipForward />
        </button>
      </div>

      {/* ATIVIDADE */}
       <input
        className={`activity-text ${mode}`}
        placeholder="Qual o foco do momento?"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
      />


      
    </div>
  );
}
