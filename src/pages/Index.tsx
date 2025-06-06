import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import FileUploader from "@/components/FileUploader";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const CORRECT_PASSWORD = "music123"; // Здесь можно изменить пароль

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogin = (password: string) => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Неверный пароль");
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);

    // Имитация загрузки файла
    setTimeout(() => {
      setUploadedFile(file);
      setIsUploading(false);
    }, 1000);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUploadedFile(null);
    setLoginError("");
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Icon name="Music" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Музыкальная Коллекция
              </h1>
              <p className="text-gray-600">
                Загружайте, слушайте и скачивайте MP3
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-gray-600 hover:text-gray-900"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {!uploadedFile ? (
            <FileUploader
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
            />
          ) : (
            <AudioPlayer file={uploadedFile} onRemove={handleRemoveFile} />
          )}

          {uploadedFile && (
            <div className="text-center">
              <Button
                onClick={() => setUploadedFile(null)}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Icon name="Plus" size={16} />
                Загрузить другой файл
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>🎵 Наслаждайтесь музыкой в безопасном пространстве</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
