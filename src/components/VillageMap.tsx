import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Library, Gamepad2, Users, Star, Trophy } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import villageMapImage from '@/assets/village-map.jpg';

interface VillageHotspot {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  position: { x: number; y: number };
  unlocked: boolean;
  stars?: number;
}

const VillageMap = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [userStars] = useState(12); // Mock user stars

  const hotspots: VillageHotspot[] = [
    {
      id: 'school',
      name: 'School',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Learn Math, Science, English & Computer Basics',
      position: { x: 25, y: 35 },
      unlocked: true,
      stars: 8
    },
    {
      id: 'library',
      name: 'Library',
      icon: <Library className="w-6 h-6" />,
      description: 'Offline Resources & Study Materials',
      position: { x: 70, y: 25 },
      unlocked: true,
      stars: 3
    },
    {
      id: 'playground',
      name: 'Playground',
      icon: <Gamepad2 className="w-6 h-6" />,
      description: 'Quizzes, Games & Fun Activities',
      position: { x: 50, y: 70 },
      unlocked: userStars >= 5,
      stars: 1
    },
    {
      id: 'teachers-room',
      name: "Teacher's Room",
      icon: <Users className="w-6 h-6" />,
      description: 'Teacher Dashboard & Progress Tracking',
      position: { x: 75, y: 60 },
      unlocked: false // Only for teachers
    }
  ];

  const handleHotspotClick = (hotspot: VillageHotspot) => {
    if (hotspot.unlocked) {
      setSelectedHotspot(hotspot.id);
      // Here you would navigate to the specific section
      console.log(`Navigating to ${hotspot.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <div className="p-4 bg-card/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-primary">🏘️ Vidya Gaon</h1>
            <p className="text-muted-foreground">Digital Village Classroom</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-star-gold text-star-gold" />
              {userStars} Stars
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Level 3
            </Badge>
            <UserAvatar />
          </div>
        </div>
      </div>

      {/* Village Map */}
      <div className="relative max-w-6xl mx-auto p-4">
        <div 
          className="relative w-full aspect-[3/2] rounded-lg overflow-hidden shadow-village"
          style={{
            backgroundImage: `url(${villageMapImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Hotspots */}
          {hotspots.map((hotspot) => (
            <Button
              key={hotspot.id}
              variant={hotspot.unlocked ? "default" : "secondary"}
              size="sm"
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 shadow-hotspot ${
                hotspot.unlocked 
                  ? 'hover:scale-110 transition-transform cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              } ${selectedHotspot === hotspot.id ? 'ring-4 ring-accent' : ''}`}
              style={{
                left: `${hotspot.position.x}%`,
                top: `${hotspot.position.y}%`
              }}
              onClick={() => handleHotspotClick(hotspot)}
              disabled={!hotspot.unlocked}
            >
              {hotspot.icon}
            </Button>
          ))}

          {/* Floating Achievement Notification */}
          <div className="absolute top-4 right-4 animate-pulse">
            <Card className="p-3 bg-gradient-celebration shadow-achievement">
              <div className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 fill-white" />
                <span className="font-medium">New Achievement!</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Hotspot Details */}
        {selectedHotspot && (
          <Card className="mt-6 p-6 shadow-village">
            {(() => {
              const hotspot = hotspots.find(h => h.id === selectedHotspot);
              if (!hotspot) return null;
              
              return (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      {hotspot.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{hotspot.name}</h3>
                    {hotspot.stars && (
                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < hotspot.stars! 
                                ? 'fill-star-gold text-star-gold' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{hotspot.description}</p>
                  <div className="flex gap-3">
                    <Button className="flex-1">
                      Enter {hotspot.name}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedHotspot(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Card>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-semibold">Lessons Completed</h4>
                <p className="text-2xl font-bold text-primary">8/12</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-star-gold fill-star-gold" />
              <div>
                <h4 className="font-semibold">Stars Earned</h4>
                <p className="text-2xl font-bold text-star-gold">{userStars}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent" />
              <div>
                <h4 className="font-semibold">Achievements</h4>
                <p className="text-2xl font-bold text-accent">5</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VillageMap;