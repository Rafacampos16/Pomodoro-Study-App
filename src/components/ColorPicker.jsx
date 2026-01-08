import { useEffect, useState } from "react";

export default function ColorPicker() {
  const [bgColor, setBgColor] = useState("#eaf2ff"); // cor clara inicial
  const [active, setActive] = useState(false);


useEffect(() => {
  document.documentElement.style.setProperty("--bg-color", bgColor);

  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  const textColor = brightness > 160 ? "#111111" : "#ffffff";
  document.documentElement.style.setProperty("--clock-color", textColor);
  

  /* 🎨 Borda inteligente */
  const borderColor =
    brightness > 160
      ? "rgba(0,0,0,0.25)"
      : "rgba(255,255,255,0.4)";

  /* 💍 Ring externo quando camufla */
  const ring =
    brightness > 160
      ? "0 0 0 3px rgba(0,0,0,0.15)"
      : "0 0 0 3px rgba(255,255,255,0.25)";

  /* 🌫 sombra leve, só apoio */
  const shadow =
    brightness > 160
      ? "0 3px 8px rgba(0,0,0,0.15)"
      : "0 3px 10px rgba(0,0,0,0.4)";

      const isDark = brightness < 160;

    document.documentElement.style.setProperty(
      "--ui-contrast",
      isDark ? "#ffffff" : "#111111"
    );

    document.documentElement.style.setProperty(
      "--ui-muted",
      isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
    );

    document.documentElement.style.setProperty(
      "--ui-border",
      isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"
    );


    
  document.documentElement.style.setProperty("--picker-border", borderColor);
  document.documentElement.style.setProperty("--picker-ring", ring);
  document.documentElement.style.setProperty("--picker-shadow", shadow);
}, [bgColor]);



  return (
    <div className="color-picker">
      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        onMouseDown={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={active ? "ring-animate" : ""}
        title="Escolher cor de fundo"
      />
    </div>
  );
}
