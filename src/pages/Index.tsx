import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import FileUploader from "@/components/FileUploader";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const CORRECT_PASSWORD = "ротфронт"; // Здесь можно изменить пароль

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-purple-700 to-purple-600 p-4 rounded border-2 border-purple-500 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded border-2 border-purple-300 flex items-center justify-center shadow-inner">
              <Icon name="Music" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                Доступ активирован
              </h1>
              <p className="text-purple-200">
                Музыкальная система готова к работе
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-purple-300 text-purple-200 hover:text-white hover:bg-purple-600 bg-purple-700"
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
            <div className="mt-8 text-center">
              <div className="text-purple-300 text-sm">
                🎵 Система Windows Media Player 2000
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-purple-400 text-sm border-t border-purple-600 pt-6">
          <p>🔒 Защищенный музыкальный терминал • Windows NT 5.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
