import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect unauthenticated users to login page
        navigate('/auth');
      } else if (profile) {
        // Redirect authenticated users to home page
        navigate('/home');
      }
    }
  }, [user, profile, loading, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Vidya Gaon...</p>
      </div>
    </div>
  );
};

export default Index;
