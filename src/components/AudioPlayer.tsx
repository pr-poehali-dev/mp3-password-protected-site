import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface AudioPlayerProps {
  file: File;
  onRemove: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ file, onRemove }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [coverArt, setCoverArt] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Извлечение обложки из MP3 файла
    const extractCoverArt = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Поиск ID3v2 тега
        if (
          uint8Array[0] === 0x49 &&
          uint8Array[1] === 0x44 &&
          uint8Array[2] === 0x33
        ) {
          const tagSize =
            ((uint8Array[6] & 0x7f) << 21) |
            ((uint8Array[7] & 0x7f) << 14) |
            ((uint8Array[8] & 0x7f) << 7) |
            (uint8Array[9] & 0x7f);

          // Поиск APIC фрейма (обложка)
          for (let i = 10; i < tagSize; i++) {
            if (
              uint8Array[i] === 0x41 &&
              uint8Array[i + 1] === 0x50 &&
              uint8Array[i + 2] === 0x49 &&
              uint8Array[i + 3] === 0x43
            ) {
              const frameSize =
                (uint8Array[i + 4] << 24) |
                (uint8Array[i + 5] << 16) |
                (uint8Array[i + 6] << 8) |
                uint8Array[i + 7];

              // Пропускаем заголовок фрейма и находим начало изображения
              let imageStart = i + 10;
              while (
                imageStart < i + frameSize &&
                uint8Array[imageStart] !== 0xff
              ) {
                imageStart++;
              }

              if (imageStart < i + frameSize) {
                const imageData = uint8Array.slice(
                  imageStart,
                  i + frameSize + 10,
                );
                const blob = new Blob([imageData], { type: "image/jpeg" });
                const imageUrl = URL.createObjectURL(blob);
                setCoverArt(imageUrl);
              }
              break;
            }
          }
        }
      } catch (error) {
        console.log("Не удалось извлечь обложку:", error);
      }
    };

    extractCoverArt();

    return () => {
      URL.revokeObjectURL(url);
      if (coverArt) URL.revokeObjectURL(coverArt);
    };
  }, [file]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const downloadFile = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Обложка по центру */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-80 h-80 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg border-4 border-purple-400 shadow-2xl overflow-hidden">
            {coverArt ? (
              <img
                src={coverArt}
                alt="Обложка альбома"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Icon
                    name="Music"
                    size={64}
                    className="text-purple-300 mx-auto mb-4"
                  />
                  <p className="text-purple-200 text-lg font-semibold">
                    Музыкальный файл
                  </p>
                  <p className="text-purple-400 text-sm">Обложка не найдена</p>
                </div>
              </div>
            )}
          </div>

          {/* Кнопка воспроизведения поверх обложки */}
          <Button
            onClick={togglePlayPause}
            size="icon"
            className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 border-2 border-purple-300 shadow-lg"
          >
            <Icon
              name={isPlaying ? "Pause" : "Play"}
              size={24}
              className="text-white"
            />
          </Button>
        </div>
      </div>

      {/* Информация о файле и управление */}
      <Card className="bg-gradient-to-r from-purple-800 to-purple-700 border-2 border-purple-500 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-400 rounded border-2 border-purple-300 flex items-center justify-center shadow-inner">
                <Icon name="Music" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-64">
                  {file.name}
                </h3>
                <p className="text-purple-300 text-sm">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-purple-300 hover:text-red-400 hover:bg-purple-600"
            >
              <Icon name="X" size={16} />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <audio ref={audioRef} src={audioUrl} preload="metadata" />

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-3 bg-purple-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${progress}%, #7c3aed ${progress}%, #7c3aed 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-purple-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={downloadFile}
              variant="outline"
              className="flex-1 border-purple-400 text-purple-200 hover:bg-purple-600 bg-purple-700 hover:text-white"
            >
              <Icon name="Download" size={16} />
              💾 Скачать
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioPlayer;
