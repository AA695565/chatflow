import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import Header from '../../components/ui/Header';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;