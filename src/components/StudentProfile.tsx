import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Settings, Star, User } from 'lucide-react';

const avatarOptions = [
  { id: 'boy1', emoji: '👦', color: 'bg-blue-500' },
  { id: 'girl1', emoji: '👧', color: 'bg-pink-500' },
  { id: 'boy2', emoji: '🧒', color: 'bg-green-500' },
  { id: 'girl2', emoji: '👧🏽', color: 'bg-purple-500' },
  { id: 'student1', emoji: '🎓', color: 'bg-orange-500' },
  { id: 'student2', emoji: '📚', color: 'bg-indigo-500' },
  { id: 'animal1', emoji: '🐱', color: 'bg-yellow-500' },
  { id: 'animal2', emoji: '🐨', color: 'bg-gray-500' },
];

const languageOptions = [
  { code: 'English', name: 'English', native: 'English' },
  { code: 'Hindi', name: 'Hindi', native: 'हिंदी' },
  { code: 'Punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

interface StudentProfileProps {
  totalStars: number;
  completedLessons: number;
  achievements: any[];
}

const StudentProfile = ({ totalStars, completedLessons, achievements }: StudentProfileProps) => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || 'boy1');
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.language || 'English');
  const [isUpdating, setIsUpdating] = useState(false);

  const currentAvatar = avatarOptions.find(avatar => avatar.id === (profile?.avatar || 'boy1'));
  const currentLanguage = languageOptions.find(lang => lang.code === profile?.language);

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    
    const { error } = await updateProfile({
      avatar: selectedAvatar,
      language: selectedLanguage,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated!",
        description: "Your avatar and language preferences have been saved.",
      });
      setIsOpen(false);
    }
    
    setIsUpdating(false);
  };

  const getProgressLevel = () => {
    if (completedLessons >= 10) return 5;
    if (completedLessons >= 8) return 4;
    if (completedLessons >= 6) return 3;
    if (completedLessons >= 4) return 2;
    return 1;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-card/90 backdrop-blur-sm">
          <Settings className="w-4 h-4 mr-2" />
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Student Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Profile Display */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full ${currentAvatar?.color} flex items-center justify-center text-2xl`}>
                {currentAvatar?.emoji}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{profile?.name}</h3>
                <Badge variant="secondary">Student</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-yellow-600">{totalStars}</span>
                </div>
                <p className="text-sm text-muted-foreground">Stars</p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">Level {getProgressLevel()}</div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Choose Your Avatar</h4>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`w-full aspect-square rounded-lg ${avatar.color} flex items-center justify-center text-xl transition-all hover:scale-105 ${
                    selectedAvatar === avatar.id 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Language / भाषा / ਭਾਸ਼ਾ</h4>
            <div className="grid grid-cols-3 gap-2">
              {languageOptions.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${
                    selectedLanguage === language.code
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{language.name}</div>
                  <div className="text-sm text-muted-foreground">{language.native}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Recent Achievements</h4>
              <div className="space-y-2">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{achievement.achievement}</p>
                    </div>
                    <Badge variant="outline">{achievement.stars} ⭐</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button 
            onClick={handleSaveProfile} 
            className="w-full"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfile;