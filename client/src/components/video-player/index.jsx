import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Settings,
  Check,
} from "lucide-react";


function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate = () => {},
  progressData = {},
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState(null); // 'speed' or 'quality' or null (main)
  const [currentQuality, setCurrentQuality] = useState("Auto");

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualityOptions = ["Auto", "1080p", "720p", "480p"];

  function handlePlayAndPause() {
    setPlaying(!playing);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played);
    }
  }

  function handleRewind() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
  }

  function handleForward() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleSeekChange(newValue) {
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }

    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  function handleReplay() {
    setPlayed(0);
    setPlaying(true);
    playerRef?.current?.seekTo(0);
    setSeeking(false);
  }

  function handleOnEnded() {
    setPlayed(1);
    setPlaying(false);
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
      ${isFullScreen ? "w-screen h-screen" : ""}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        playbackRate={playbackRate}
        onEnded={handleOnEnded}
      />
      
      {showControls && played === 1 && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
             <Button 
                onClick={handleReplay}
                className="flex items-center gap-2 bg-white text-black hover:bg-gray-200"
                size="lg"
             >
                <RotateCcw className="h-6 w-6" />
                Play Again
             </Button>
         </div>
      )}
      
      {/* Settings Menu Overlay */}
      {showSettings && (
        <div className="absolute bottom-20 right-4 bg-black/90 text-white rounded-lg p-2 w-48 shadow-lg z-20 animate-in fade-in slide-in-from-bottom-2">
           {!activeSettingsTab ? (
             <div className="flex flex-col gap-1">
               <button 
                 onClick={() => setActiveSettingsTab("speed")} 
                 className="flex justify-between items-center p-2 hover:bg-gray-800 rounded w-full text-left text-sm"
               >
                 <span>Playback Speed</span>
                 <span className="text-gray-400 font-bold">{playbackRate}x</span>
               </button>
               <button 
                onClick={() => setActiveSettingsTab("quality")}
                className="flex justify-between items-center p-2 hover:bg-gray-800 rounded w-full text-left text-sm"
               >
                 <span>Quality</span>
                 <span className="text-gray-400 font-bold">{currentQuality}</span>
               </button>
             </div>
           ) : activeSettingsTab === "speed" ? (
             <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setActiveSettingsTab(null)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded w-full text-left text-sm border-b border-gray-700 mb-1"
                >
                    <Settings className="w-4 h-4" />
                    <span className="font-bold">Back</span>
                </button>
                {speedOptions.map(speed => (
                    <button 
                        key={speed}
                        onClick={() => {
                            setPlaybackRate(speed);
                            setShowSettings(false);
                            setActiveSettingsTab(null);
                        }}
                        className="flex justify-between items-center p-2 hover:bg-gray-800 rounded w-full text-left text-sm"
                    >
                        <span>{speed}x</span>
                        {playbackRate === speed && <Check className="w-4 h-4 text-orange-500" />}
                    </button>
                ))}
             </div>
           ) : (
            <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setActiveSettingsTab(null)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded w-full text-left text-sm border-b border-gray-700 mb-1"
                >
                    <Settings className="w-4 h-4" />
                    <span className="font-bold">Back</span>
                </button>
                {qualityOptions.map(quality => (
                    <button 
                        key={quality}
                        onClick={() => {
                            setCurrentQuality(quality);
                            setShowSettings(false);
                            setActiveSettingsTab(null);
                        }}
                        className="flex justify-between items-center p-2 hover:bg-gray-800 rounded w-full text-left text-sm"
                    >
                        <span>{quality}</span>
                        {currentQuality === quality && <Check className="w-4 h-4 text-orange-500" />}
                    </button>
                ))}
             </div>
           )}
        </div>
      )}

      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                className="w-24 "
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white">
                {formatTime(played * (playerRef?.current?.getDuration() || 0))}/{" "}
                {formatTime(playerRef?.current?.getDuration() || 0)}
              </div>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                onClick={() => {
                    setShowSettings(!showSettings);
                    setActiveSettingsTab(null);
                }}
              >
                <Settings className="h-6 w-6" />
              </Button>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
