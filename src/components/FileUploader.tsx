import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  isUploading,
}) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("audio/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("audio/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Card className="border-2 border-dashed border-purple-400 hover:border-purple-300 transition-colors bg-gradient-to-br from-purple-800 to-purple-700">
      <CardContent className="p-8">
        <div
          className="text-center space-y-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded border-2 border-purple-400 flex items-center justify-center shadow-inner">
            {isUploading ? (
              <Icon
                name="Loader2"
                size={32}
                className="text-purple-200 animate-spin"
              />
            ) : (
              <Icon name="Upload" size={32} className="text-purple-200" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {isUploading ? "Загрузка файла..." : "Загрузите MP3 файл"}
            </h3>
            <p className="text-sm text-purple-300">
              Перетащите файл сюда или нажмите кнопку ниже
            </p>
          </div>

          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              className="pointer-events-none border-purple-400 text-purple-200 bg-purple-700"
              disabled={isUploading}
            >
              <Icon name="FolderOpen" size={16} />
              📁 Выбрать файл
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
