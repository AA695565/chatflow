import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import Header from '../../components/ui/Header';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="w-full">
              <SignupForm onSuccess={handleSignupSuccess} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;