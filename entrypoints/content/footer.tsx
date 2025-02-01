import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const Footer: React.FC<{
  musicSamples: any;
  nowStartText: string;
}> = ({ musicSamples, nowStartText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.02);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(
    musicSamples?.[0]
      ? {
          ...musicSamples[0],
          src: chrome.runtime.getURL(`audio/${musicSamples[0].src}`),
        }
      : null
  );
  const [trackCache, setTrackCache] = useState<{ [key: string]: string }>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  // 初期読み込み時に全てのBGMをキャッシュ
  const [isCacheMusic, setIsCacheMusic] = useState(false);
  useEffect(() => {
    if (musicSamples && !isCacheMusic) {
      const cacheAllTracks = async () => {
        const newCache = {};
        for (const sample of musicSamples) {
          const audioUrl = chrome.runtime.getURL(`audio/${sample.src}`);
          newCache[sample.src] = audioUrl;
        }
        setTrackCache(newCache);
      };

      cacheAllTracks();
      setIsCacheMusic(true);
    }
  }, [musicSamples]);

  // スクロール位置によって音楽を切り替える
  useEffect(() => {
    if (nowStartText !== "") {
      const matchedTrack = musicSamples.find((sample: any) =>
        nowStartText.includes(sample.start_text)
      );
      if (matchedTrack) {
        if (trackCache[matchedTrack.src]) {
          setCurrentTrack({
            ...matchedTrack,
            src: trackCache[matchedTrack.src],
          });
        }
      }
    }
  }, [nowStartText, musicSamples, trackCache]);

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
      <div className="flex items-center w-full flex-col">
        {musicSamples && (
          <div className="flex justify-center items-center">
            <div>
              <Music className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium mr-4">
              {currentTrack ? currentTrack.title : "No Track"}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTrack ? currentTrack.artist : ""}
            </div>
          </div>
        )}
        <div className="flex w-full items-center justify-between space-x-2">
          {musicSamples && (
            <>
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
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
