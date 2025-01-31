import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";

import { Play, Pause, Volume2, Plus, Save, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

import shining_star from "~/assets/music/maou_14_shining_star.mp3";
import burning_heart from "~/assets/music/maou_08_burning_heart.mp3";

const Footer: React.FC<{
  onAddReference: (reference: { name: string; url: string }) => void;
  scrollPosition: number;
  musicSamples: any;
  nowStartText: string;
}> = ({ onAddReference, scrollPosition, musicSamples, nowStartText }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.02);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(musicSamples?.[0] || null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 音楽が切り替わったことを検知する
  useEffect(() => {
    if (nowStartText !== "") {
      console.log("nowStartText: %o", nowStartText);
      const matchedTrack = musicSamples.find(
        (sample: any) => sample.start_text === nowStartText
      );
      if (matchedTrack) {
        setCurrentTrack(matchedTrack);
      }
    }
  }, [nowStartText, musicSamples]);

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      if (!isAdding) return;
      const target = event.target as HTMLElement;
      target.style.outline = "2px solid rgba(166, 241, 224, 1)";
      target.style.backgroundColor = "rgba(115, 199, 199, 0.2)";

      target.addEventListener(
        "mouseout",
        () => {
          target.style.outline = "";
          target.style.backgroundColor = "";
        },
        { once: true }
      );
    };

    const handleElementClick = (event: MouseEvent) => {
      if (!isAdding) return;
      event.preventDefault();
      event.stopPropagation();
      const target = event.target as HTMLElement;

      const path: string[] = [];
      let currentElement: HTMLElement | null = target;

      while (currentElement) {
        let selector = currentElement.tagName.toLowerCase();
        //const tagName = currentElement.tagName.toLowerCase();
        const className = currentElement.className;

        const id = currentElement.id;
        if (id) {
          selector += `#${id}`;
        } else if (className) {
          selector += `.${className.split(" ").join(".")}`;
        }
        path.unshift(selector);
        currentElement = currentElement.parentElement;
      }

      let href = "";
      if (target.querySelectorAll) {
        const aElements = target.querySelectorAll("a");
        aElements.forEach((a) => {
          if (a.href) {
            href = a.href;
          }
        });
      }

      const reference = {
        name: target.innerText.slice(0, 16),
        url: href,
        path: path,
      };
      onAddReference(reference);
      setIsAdding(false);
    };

    if (isAdding) {
      const elements = document.querySelectorAll("a, button");

      elements.forEach((element) => {
        element.style.pointerEvents = "none";
      });

      setTimeout(() => {
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("click", handleElementClick);
      }, 500);
    } else {
      const elements = document.querySelectorAll("a, button");

      elements.forEach((element) => {
        element.style.pointerEvents = "auto";
      });

      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleElementClick);
    }

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleElementClick);
    };
  }, [isAdding, onAddReference]);

  const handleAddClick = () => {
    setIsAdding(!isAdding);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && !isFirstPlay) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (musicSamples) {
      if (scrollPosition >= 450) {
        setCurrentTrack((prevTrack) => {
          const currentIndex = musicSamples.findIndex(
            (track: any) => track.src === prevTrack?.src
          );
          const nextIndex = currentIndex + 1;
          if (nextIndex < musicSamples.length) {
            return musicSamples[nextIndex];
          } else {
            return prevTrack;
          }
        });
      } else {
        setCurrentTrack((prevTrack) => {
          const currentIndex = musicSamples.findIndex(
            (track: any) => track.src === prevTrack?.src
          );
          const prevIndex = currentIndex - 1;
          if (prevIndex >= 0) {
            return musicSamples[prevIndex];
          } else {
            return prevTrack;
          }
        });
      }
    }
  }, [scrollPosition, musicSamples]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setIsFirstPlay(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <footer className="absolute bottom-0 w-full flex my-4">
      <hr />
      <div className="flex items-center flex-col">
        <div className="flex justify-center items-center">
          <div className="text-sm font-medium mx-4">
            {currentTrack ? currentTrack.title : "No Track"}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentTrack ? currentTrack.artist : ""}
          </div>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <audio
            ref={audioRef}
            src={currentTrack ? currentTrack.src : ""}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            loop
          />
          <div className="flex-1 flex items-center">
            <Button variant="ghost" size="icon" onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center space-x-2 w-1/3">
              <span className="text-xs">{formatTime(currentTime)}/</span>
              <span className="text-xs">{formatTime(duration)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={[volume]}
                max={0.1}
                step={0.001}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              id="add-button"
              className={`font-bold py-2 px-4 rounded 
              ${
                isAdding
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-blue-500 hover:bg-blue-700 text-4xl"
              }`}
              onClick={handleAddClick}
              variant="ghost"
              size="icon"
            >
              {isAdding ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
