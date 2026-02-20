import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { FaVolumeXmark, FaVolumeHigh } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import HoverLinks from "./HoverLinks";
import { config } from "../config";

const SocialIcons = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const assetModules = import.meta.glob("../assets/**/*.{mp3,ogg,webm,m4a}", { eager: false }) as Record<string, () => Promise<{ default: string }>>;

  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (!config.music) return;
      if (audioRef.current) return;
      let src: string | null = null;
      if (config.music.url) {
        src = encodeURI(config.music.url);
      } else if ((config.music as any).module) {
        const wanted = String((config.music as any).module).replace(/^\.?\/?src\//, "../");
        const key = Object.keys(assetModules).find(k => k.endsWith(wanted));
        if (key) {
          const mod = await assetModules[key]();
          src = mod.default;
        }
      }
      if (!src) return;
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = Math.max(0, Math.min(1, config.music?.volume ?? 0.4));
      audio.muted = true;
      audioRef.current = audio;
      if (config.music.autoplay !== false) {
        audio.play().catch(() => {});
      }
      const unlock = () => {
        audio.play()
          .then(() => {
            if ((config.music as any)?.autoUnmuteOnFirstInteraction) {
              audio.muted = false;
              setMuted(false);
            }
          })
          .catch(() => {});
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      };
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
    };
    setup();
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const a = audioRef.current;
    if (a.paused) {
      a.play().catch(() => {});
    }
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {(config.music?.url || (config.music as any)?.module) && (
          <span className="audio-toggle-slot">
            <a href="#" onClick={(e) => { e.preventDefault(); toggleMute(); }} title={muted ? "Unmute" : "Mute"}>
              {muted ? <FaVolumeXmark /> : <FaVolumeHigh />}
            </a>
          </span>
        )}
        <span>
          <a href={config.contact.github} target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href={config.contact.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={config.contact.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a className="resume-button" href={config.resume?.url || "#"} target={config.resume?.url ? "_blank" : undefined} rel={config.resume?.url ? "noopener noreferrer" : undefined}>
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
      {/* hidden audio element (managed via audioRef) */}
    </div>
  );
};

export default SocialIcons;
