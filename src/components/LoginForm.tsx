import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface LoginFormProps {
  onLogin: (password: string) => void;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Имитация проверки пароля
    setTimeout(() => {
      onLogin(password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
            <Icon name="Music" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Добра утра, Таира Крофт!
          </CardTitle>
          <CardDescription className="text-purple-200">
            Введите код доступа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                required
              />
              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} />
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={16} />
                  Войти
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
