import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';


const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, authError, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const result = await signIn(formData.email, formData.password);
    
    if (result?.success) {
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to continue to ChatFlow
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-9"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-9 pr-9"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !formData.email || !formData.password}
            loading={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo credentials info */}
        <div className="mt-4 p-3 bg-muted/30 rounded-md">
          <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>📧 admin@chatflow.com</div>
            <div>🔑 password123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;