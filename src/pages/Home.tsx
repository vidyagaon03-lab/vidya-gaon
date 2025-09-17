import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import VillageMap from '@/components/VillageMap';
import CommunityWall from '@/components/CommunityWall';
import { useAuth } from '@/hooks/useAuth';
import { Map, Users, LogOut, LayoutDashboard } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('village');
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect unauthenticated users to login page
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleDashboard = () => {
    if (profile?.role === 'student') {
      navigate('/student-dashboard');
    } else if (profile?.role === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Vidya Gaon...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header with Auth Controls */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        <Button
          onClick={handleDashboard}
          variant="outline"
          size="sm"
          className="bg-card/90 backdrop-blur-sm"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="bg-card/90 backdrop-blur-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 bg-card/90 backdrop-blur-sm">
          <TabsTrigger value="village" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Village Map
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community Wall
          </TabsTrigger>
        </TabsList>

        <TabsContent value="village" className="pt-16">
          <VillageMap />
        </TabsContent>

        <TabsContent value="community" className="pt-16">
          <div className="max-w-4xl mx-auto p-4">
            <CommunityWall />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;