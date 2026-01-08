import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ListMusic,
  Volume2,
  VolumeX,
} from "lucide-react";



import lofi1 from "../assets/music/lofi1.mp3";
import lofi2 from "../assets/music/lofi2.mp3";
import lofi3 from "../assets/music/lofi3.mp3";
import lofi1Cover from "../assets/music/lofi1.jpg";
import lofi2Cover from "../assets/music/lofi2.webp";
import lofi3Cover from "../assets/music/lofi3.jpg";
import lofi4 from "../assets/music/lofi4.mp3";
import lofi4Cover from "../assets/music/lofi4.jpg";
import lofi5 from "../assets/music/lofi5.mp3";
import lofi5Cover from "../assets/music/lofi5.jpg";
import lofi6 from "../assets/music/lofi6.mp3";
import lofi6Cover from "../assets/music/lofi6.jpg";
import lofi7 from "../assets/music/lofi7.mp3";
import lofi7Cover from "../assets/music/lofi7.jpg";
import lofi8 from "../assets/music/lofi8.mp3";
import lofi8Cover from "../assets/music/lofi8.jpg";
import lofi9 from "../assets/music/lofi9.mp3";
import lofi9Cover from "../assets/music/lofi9.png";
import lofi10 from "../assets/music/lofi10.mp3";
import lofi10Cover from "../assets/music/lofi10.jpg";

const playlist = [
  {
    name: "Lofi ambient",
    src: lofi1,
    cover: lofi1Cover,
  },
  {
    name: "Good Night",
    src: lofi2,
    cover: lofi2Cover,
  },
  {
    name: "Rainy Lofi City",
    src: lofi3,
    cover: lofi3Cover,
  },
   {
    name: "Spring Lofi",
    src: lofi4,
    cover: lofi4Cover,
  },
  {
    name: "Lofi background",
    src: lofi5,
    cover: lofi5Cover,
  },
   {
    name: "Lofi hiphop beats",
    src: lofi6,
    cover: lofi6Cover,
  },
  {
    name: "Lofi dreams",
    src: lofi7,
    cover: lofi7Cover,
  },
  {
    name: "Coffee Lofi",
    src: lofi8,
    cover: lofi8Cover,
  },
  {
    name: "Lofi Chill",
    src: lofi9,
    cover: lofi9Cover,
  },
   {
    name: "Relaxing Beat",
    src: lofi10,
    cover: lofi10Cover,
  },
];


export default function MusicPlayer() {
  const audioRef = useRef(new Audio());
  const progressRef = useRef(null);

  const [index, setIndex] = useState(
    Number(localStorage.getItem("musicIndex")) || 0
  );
  const [playing, setPlaying] = useState(true);
  const [showList, setShowList] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /* CARREGA MÚSICA */
    useEffect(() => {
        const audio = audioRef.current;
        audio.src = playlist[index].src;
        audio.load();
        audio.play();
        setPlaying(true);

        localStorage.setItem("musicIndex", index);
    }, [index]);


  /* TIME UPDATE */
 useEffect(() => {
  const audio = audioRef.current;

  const update = () => {
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
  };

  audio.addEventListener("timeupdate", update);
  audio.addEventListener("loadedmetadata", update);

  return () => {
    audio.removeEventListener("timeupdate", update);
    audio.removeEventListener("loadedmetadata", update);
  };
}, []);


  const togglePlay = () => {
    const audio = audioRef.current;
    playing ? audio.pause() : audio.play();
    setPlaying(!playing);
  };

  const next = () => {
    setIndex((i) => (i + 1) % playlist.length);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + playlist.length) % playlist.length);
  };

  const seek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (time) => {
  if (!time) return "00:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const [volume, setVolume] = useState(0.6);
const [muted, setMuted] = useState(false);

useEffect(() => {
  audioRef.current.muted = muted;
}, [muted]);


useEffect(() => {
  audioRef.current.volume = volume;
}, [volume]);

useEffect(() => {
  const audio = audioRef.current;

  audio.src = playlist[index].src;
  audio.load();

  if (playing) {
    audio.play();
  }

  localStorage.setItem("musicIndex", index);
}, [index]);


useEffect(() => {
  playlist.forEach((track, i) => {
    const audio = new Audio(track.src);
    audio.addEventListener("loadedmetadata", () => {
      playlist[i].duration = audio.duration;
    });
  });
}, []);

useEffect(() => {
  const audio = audioRef.current;

  return () => {
    audio.pause();
    audio.currentTime = 0;
  };
}, []);



  return (
    
 <div className="music-player">
  <img
  src={playlist[index].cover}
  alt="Capa"
  className="music-cover"
/>

  <div className="music-title">
    {playlist[index].name}
  </div>

  {/* ⏱️ PROGRESSO */}
  <div className="progress-section">
    <div
      className="progress-container"
      ref={progressRef}
      onClick={seek}
    >
      <div
        className="progress"
        style={{
          width: duration
            ? `${(currentTime / duration) * 100}%`
            : "0%",
        }}
      />
    </div>

    <div className="time-row">
      {formatTime(currentTime)} - {formatTime(duration)}
    </div>
  </div>

  {/* ▶️ CONTROLES */}
  <div className="player-controls">
    <button onClick={prev}>
      <SkipBack size={18} />
    </button>

    <button className="play-btn" onClick={togglePlay}>
      {playing ? <Pause size={22} /> : <Play size={22} />}
    </button>

    <button onClick={next}>
      <SkipForward size={18} />
    </button>

    {/* 🔊 Volume */}
    <div className="volume-control">
      <button
        className="mute-btn"
        onClick={() => setMuted((m) => !m)}
        >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(e.target.value)}
      />
    </div>

    {/* 📂 Playlist */}
    <button onClick={() => setShowList(!showList)}>
      <ListMusic size={18} />
    </button>
  </div>

  {showList && (
 <div className="playlist-card">
  {playlist.map((m, i) => (
    <button
      key={i}
      className={`playlist-item ${
        i === index ? "active" : ""
      }`}
      onClick={() => {
        setIndex(i);
        setPlaying(true);
      }}
    >
      <img
        src={m.cover}
        alt=""
        className="playlist-cover"
      />

      <div className="playlist-info">
        <span className="playlist-name">
          {m.name}
        </span>
        <span className="playlist-time">
          {m.duration
            ? formatTime(m.duration)
            : "--:--"}
        </span>
      </div>
    </button>
  ))}
</div>
)}

</div>

);

}
