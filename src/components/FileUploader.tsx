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
    <Card className="border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors">
      <CardContent className="p-8">
        <div
          className="text-center space-y-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            {isUploading ? (
              <Icon
                name="Loader2"
                size={32}
                className="text-purple-600 animate-spin"
              />
            ) : (
              <Icon name="Upload" size={32} className="text-purple-600" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {isUploading ? "Загрузка файла..." : "Загрузите MP3 файл"}
            </h3>
            <p className="text-sm text-gray-500">
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
              className="pointer-events-none"
              disabled={isUploading}
            >
              <Icon name="FolderOpen" size={16} />
              Выбрать файл
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
